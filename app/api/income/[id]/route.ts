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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const amount = body?.amount;
    const source = typeof body?.source === "string" ? body.source.trim() : "";
    const date = typeof body?.date === "string" ? body.date.trim() : "";
    const note = typeof body?.note === "string" ? body.note.trim() : "";
    const cents = Math.round(amount * 100);

    if (
      typeof amount !== "number" ||
      amount <= 0 ||
      !Number.isSafeInteger(cents) ||
      Math.abs(amount * 100 - cents) > 1e-7 ||
      !source
    ) {
      return NextResponse.json({ error: "Укажите источник и корректную сумму" }, { status: 400 });
    }

    const parsedDate = new Date(date);
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== date
    ) {
      return NextResponse.json({ error: "Укажите корректную дату" }, { status: 400 });
    }

    const { id } = await params;
    const result = await prisma.income.updateMany({
      where: { id, userId: user.id },
      data: { amount, source, date, note },
    });

    if (!result.count) {
      return NextResponse.json({ error: "Доход не найден" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("INCOME_UPDATE_ERROR", error);
    return NextResponse.json({ error: "Не удалось сохранить доход" }, { status: 500 });
  }
}
