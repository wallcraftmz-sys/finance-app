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

    const goal = await prisma.goal.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    if (!goal) {
      return NextResponse.json({ error: "Цель не найдена" }, { status: 404 });
    }

    await prisma.goal.delete({
      where: { id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("GOAL_DELETE_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка удаления цели" },
      { status: 500 }
    );
  }
}