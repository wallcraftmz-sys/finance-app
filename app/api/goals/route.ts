
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

const LITE_GOALS_LIMIT = 3;

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      goals,
      plan: user.plan === "PRO" ? "PRO" : "LITE",
      limit: user.plan === "PRO" ? null : LITE_GOALS_LIMIT,
    });
  } catch (error) {
    console.error("GOALS_GET_ERROR", error);

    return NextResponse.json(
      { error: "Ошибка загрузки целей" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const title = String(body.title || "").trim();
    const targetAmount = Number(body.targetAmount || 0);

    if (
      !title ||
      !Number.isFinite(targetAmount) ||
      targetAmount <= 0
    ) {
      return NextResponse.json(
        { error: "Название и сумма обязательны" },
        { status: 400 }
      );
    }

    // Moniq LITE: максимум 3 финансовые цели
    if (user.plan !== "PRO") {
      const goalsCount = await prisma.goal.count({
        where: { userId: user.id },
      });

      if (goalsCount >= LITE_GOALS_LIMIT) {
        return NextResponse.json(
          {
            error:
              "В Moniq LITE можно создать максимум 3 финансовые цели. Для большего количества потребуется Moniq PRO.",
            code: "LITE_GOALS_LIMIT",
            plan: "LITE",
            limit: LITE_GOALS_LIMIT,
          },
          { status: 403 }
        );
      }
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        targetAmount,
        currency: user.currency,
        userId: user.id,
      },
    });

    return NextResponse.json({
      ok: true,
      goal,
    });
  } catch (error) {
    console.error("GOALS_POST_ERROR", error);

    return NextResponse.json(
      { error: "Ошибка создания цели" },
      { status: 500 }
    );
  }
}
