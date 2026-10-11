import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { createHash } from "node:crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const token = String(body.token ?? "");
    const password = String(body.password ?? "");

    if (!/^[a-f0-9]{64}$/.test(token)) {
      return NextResponse.json(
        { error: "Недействительная ссылка" },
        { status: 400 }
      );
    }

    if (password.length < 8 || Buffer.byteLength(password, "utf8") > 72) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 8 символов и не превышать 72 байта" },
        { status: 400 }
      );
    }

    const tokenHash = createHash("sha256").update(token).digest("hex");

    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });

    if (!record || record.expiresAt <= new Date()) {
      return NextResponse.json(
        { error: "Ссылка недействительна или срок её действия истёк" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    // Удаление токена, изменение пароля и завершение сессий
    // выполняются одной транзакцией.
    await prisma.$transaction(async (tx) => {
      const claimed = await tx.passwordResetToken.deleteMany({
        where: {
          id: record.id,
          expiresAt: { gt: new Date() },
        },
      });

      if (claimed.count !== 1) {
        throw new Error("RESET_TOKEN_ALREADY_USED");
      }

      await tx.user.update({
        where: { id: record.userId },
        data: { passwordHash },
      });

      await tx.session.deleteMany({
        where: { userId: record.userId },
      });

      await tx.passwordResetToken.deleteMany({
        where: { userId: record.userId },
      });
    });

    const response = NextResponse.json({
      ok: true,
      message: "Пароль успешно изменён",
    });

    response.cookies.set("finance_session", "", {
      path: "/",
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "RESET_TOKEN_ALREADY_USED") {
      return NextResponse.json(
        { error: "Ссылка уже использована или срок её действия истёк" },
        { status: 400 }
      );
    }

    console.error("RESET_PASSWORD_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
