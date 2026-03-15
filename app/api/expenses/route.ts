import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const expenses = await prisma.expense.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("EXPENSE_GET_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка загрузки расходов" },
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
    const category = String(body.category || "").trim();
    const date = String(body.date || "").trim();
    const note = String(body.note || "").trim();

    if (!amount || !date || !category) {
      return NextResponse.json(
        { error: "Сумма, категория и дата обязательны" },
        { status: 400 }
      );
    }

    const expense = await prisma.expense.create({
      data: {
        amount,
        category,
        date,
        note,
        userId: user.id,
      },
    });

    return NextResponse.json({ ok: true, expense });
  } catch (error) {
    console.error("EXPENSE_POST_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка создания расхода" },
      { status: 500 }
    );
  }
}