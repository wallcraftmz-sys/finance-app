import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);
    const amount = body?.amount;

    if (
      typeof amount !== "number" ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isSafeInteger(Math.round(amount * 100)) ||
      Math.abs(amount * 100 - Math.round(amount * 100)) > 1e-7
    ) {
      return NextResponse.json(
        { error: "Введите положительную сумму с точностью до двух знаков" },
        { status: 400 }
      );
    }

    // Уменьшаем накопления только если денег достаточно.
    // Проверка и изменение выполняются одной операцией БД.
    const result = await prisma.goal.updateMany({
      where: {
        id,
        userId: user.id,
        savedAmount: {
          gte: amount,
        },
      },
      data: {
        savedAmount: {
          decrement: amount,
        },
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        {
          error: "Цель не найдена или недостаточно накопленных средств",
        },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.findFirst({
      where: {
        id,
        userId: user.id,
      },
    });

    return NextResponse.json({ ok: true, goal });
  } catch (error) {
    console.error("GOAL_WITHDRAW_ERROR", error);

    return NextResponse.json(
      { error: "Не удалось снять деньги с цели" },
      { status: 500 }
    );
  }
}
