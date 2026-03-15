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

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!expense) {
      return NextResponse.json({ error: "Расход не найден" }, { status: 404 });
    }

    await prisma.expense.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("EXPENSE_DELETE_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка удаления расхода" },
      { status: 500 }
    );
  }
}