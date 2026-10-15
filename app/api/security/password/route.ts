import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Необходимо войти в аккаунт" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const currentPassword = body.currentPassword;
    const newPassword = body.newPassword;
    const confirmPassword = body.confirmPassword;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      typeof confirmPassword !== "string"
    ) {
      return NextResponse.json(
        { error: "Заполните все поля" },
        { status: 400 }
      );
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "Заполните все поля" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8 || newPassword.length > 72) {
      return NextResponse.json(
        { error: "Новый пароль должен содержать от 8 до 72 символов" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Новые пароли не совпадают" },
        { status: 400 }
      );
    }

    const account = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });

    if (!account) {
      return NextResponse.json(
        { error: "Аккаунт не найден" },
        { status: 404 }
      );
    }

    const validPassword = await bcrypt.compare(
      currentPassword,
      account.passwordHash
    );

    if (!validPassword) {
      return NextResponse.json(
        { error: "Неверный текущий пароль" },
        { status: 400 }
      );
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "Новый пароль должен отличаться от текущего" },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    const cookieStore = await cookies();
    const currentToken = cookieStore.get("finance_session")?.value;

    if (!currentToken) {
      return NextResponse.json(
        { error: "Текущий сеанс не найден" },
        { status: 401 }
      );
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      }),
      prisma.session.deleteMany({
        where: {
          userId: user.id,
          token: { not: currentToken },
        },
      }),
    ]);

    return NextResponse.json({
      ok: true,
      message: "Пароль успешно изменён",
    });
  } catch (error) {
    console.error("PASSWORD_CHANGE_ERROR", error);

    return NextResponse.json(
      { error: "Не удалось изменить пароль" },
      { status: 500 }
    );
  }
}
