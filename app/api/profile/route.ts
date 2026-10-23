import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
    const name = body.name;

    if (typeof name !== "string") {
      return NextResponse.json(
        { error: "Некорректное имя" },
        { status: 400 }
      );
    }

    const cleanName = name.trim();

    if (cleanName.length < 2 || cleanName.length > 60) {
      return NextResponse.json(
        { error: "Имя должно содержать от 2 до 60 символов" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: cleanName },
      select: { id: true, name: true, email: true },
    });

    return NextResponse.json({ ok: true, user: updated });
  } catch (error) {
    console.error("PROFILE_UPDATE_ERROR", error);

    return NextResponse.json(
      { error: "Не удалось сохранить профиль" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      currency: user.currency,
      plan: user.plan,
    });
  } catch (error) {
    console.error("PROFILE_GET_ERROR", error);

    return NextResponse.json(
      { error: "Failed to load profile" },
      { status: 500 }
    );
  }
}
