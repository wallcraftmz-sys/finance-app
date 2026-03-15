import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const incomes = await prisma.income.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ incomes });
  } catch (error) {
    console.error("INCOME_GET_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка загрузки доходов" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await req.json();

    const amount = Number(body.amount || 0);
    const source = String(body.source || "").trim();
    const date = String(body.date || "").trim();
    const note = String(body.note || "").trim();

    if (!amount || !date || !source) {
      return NextResponse.json(
        { error: "Сумма, источник и дата обязательны" },
        { status: 400 }
      );
    }

    const income = await prisma.income.create({
      data: {
        amount,
        source,
        date,
        note,
        userId: user.id,
      },
    });

    return NextResponse.json({ ok: true, income });
  } catch (error) {
    console.error("INCOME_POST_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка создания дохода" },
      { status: 500 }
    );
  }
}