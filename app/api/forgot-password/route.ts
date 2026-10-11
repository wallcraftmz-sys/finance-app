import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { createHash, randomBytes } from "node:crypto";

export const runtime = "nodejs";

const successMessage =
  "Если аккаунт с такой почтой существует, мы отправим ссылку для восстановления.";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Введите корректную электронную почту" },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const appUrl = process.env.APP_URL;

    if (!apiKey || !appUrl) {
      console.error("Password reset email is not configured");
      return NextResponse.json(
        { error: "Отправка писем временно недоступна" },
        { status: 503 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ ok: true, message: successMessage });
    }

    // Ограничение повторных запросов для одного аккаунта.
    const recent = await prisma.passwordResetToken.findFirst({
      where: {
        userId: user.id,
        createdAt: { gt: new Date(Date.now() - 60_000) },
      },
    });

    if (recent) {
      return NextResponse.json({ ok: true, message: successMessage });
    }

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");

    const resetRecord = await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });

    const resetUrl = new URL("/reset-password", appUrl);
    resetUrl.searchParams.set("token", token);

    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from: "Moniq <no-reply@moniq.lat>",
      to: email,
      subject: "Восстановление пароля Moniq",
      text:
        "Здравствуйте!\n\n" +
        "Для установки нового пароля перейдите по ссылке:\n\n" +
        resetUrl.toString() +
        "\n\nСсылка действует 30 минут и может использоваться только один раз." +
        "\n\nЕсли вы не запрашивали восстановление, проигнорируйте письмо.",
    });

    if (error) {
      console.error("RESET_EMAIL_ERROR", error);
      await prisma.passwordResetToken.delete({
        where: { id: resetRecord.id },
      });
      return NextResponse.json(
        { error: "Не удалось отправить письмо. Попробуйте позже." },
        { status: 503 }
      );
    }

    return NextResponse.json({ ok: true, message: successMessage });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
