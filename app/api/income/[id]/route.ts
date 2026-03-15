import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const { id } = await params;

    const income = await prisma.income.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!income) {
      return NextResponse.json({ error: "Доход не найден" }, { status: 404 });
    }

    await prisma.income.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("INCOME_DELETE_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка удаления дохода" },
      { status: 500 }
    );
  }
}