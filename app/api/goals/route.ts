import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("GOALS_GET_ERROR", error);
    return NextResponse.json({ error: "Ошибка загрузки целей" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await req.json();
    const title = String(body.title || "").trim();
    const targetAmount = Number(body.targetAmount || 0);

    if (!title || !targetAmount) {
      return NextResponse.json(
        { error: "Название и сумма обязательны" },
        { status: 400 }
      );
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        targetAmount,
        userId: user.id,
      },
    });

    return NextResponse.json({ ok: true, goal });
  } catch (error) {
    console.error("GOALS_POST_ERROR", error);
    return NextResponse.json({ error: "Ошибка создания цели" }, { status: 500 });
  }
}