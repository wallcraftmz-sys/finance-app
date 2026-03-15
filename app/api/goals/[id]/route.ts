import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type Params = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, { params }: Params) {
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

   export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  await prisma.goal.delete({
    where: { id },
  });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("GOAL_DELETE_ERROR", error);
    return NextResponse.json({ error: "Ошибка удаления цели" }, { status: 500 });
  }
}