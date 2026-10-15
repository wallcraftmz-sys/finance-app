import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import {
  getExchangeRates,
  convertCurrency,
  SUPPORTED_CURRENCIES,
  type Currency,
} from "@/lib/exchange-rates";

function isCurrency(value: string): value is Currency {
  return SUPPORTED_CURRENCIES.some((currency) => currency === value);
}

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

    let exchangeRates: Awaited<ReturnType<typeof getExchangeRates>>;

    try {
      exchangeRates = await getExchangeRates();
    } catch {
      return NextResponse.json(
        { error: "Курсы валют временно недоступны. Попробуйте позже." },
        { status: 503 }
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        // Блокируем строку пользователя на время резервирования.
        // Параллельные пополнения этого пользователя ждут друг друга.
        await tx.$queryRaw`
          SELECT id FROM "User"
          WHERE id = ${user.id}
          FOR UPDATE
        `;

        const goal = await tx.goal.findFirst({
          where: { id, userId: user.id },
        });

        if (!goal) {
          return { error: "Цель не найдена", status: 404 };
        }

        const targetCurrency = goal.currency || "EUR";

        if (!isCurrency(targetCurrency)) {
          return { error: "Валюта цели не поддерживается", status: 400 };
        }

        const [incomes, expenses, goals] = await Promise.all([
          tx.income.findMany({
            where: { userId: user.id },
            select: { amount: true, currency: true },
          }),
          tx.expense.findMany({
            where: { userId: user.id },
            select: { amount: true, currency: true },
          }),
          tx.goal.findMany({
            where: { userId: user.id },
            select: { savedAmount: true, currency: true },
          }),
        ]);

        function totalInGoalCurrency(
          items: { amount: number; currency: string }[]
        ) {
          let total = 0;

          for (const item of items) {
            const currency = item.currency || "EUR";

            if (!isCurrency(currency)) {
              throw new Error("UNSUPPORTED_CURRENCY");
            }

            total += convertCurrency(
              item.amount,
              currency,
              targetCurrency as Currency,
              exchangeRates.rates
            );
          }

          return total;
        }

        const totalIncome = totalInGoalCurrency(incomes);
        const totalExpense = totalInGoalCurrency(expenses);

        const totalReserved = totalInGoalCurrency(
          goals.map((item) => ({
            amount: item.savedAmount,
            currency: item.currency,
          }))
        );

        const available = totalIncome - totalExpense - totalReserved;

        // Небольшой допуск только для погрешности вычислений.
        if (amount > available + 0.000001) {
          return {
            error: "Недостаточно доступных средств для пополнения цели",
            status: 400,
          };
        }

        const updatedGoal = await tx.goal.update({
          where: { id: goal.id },
          data: {
            savedAmount: { increment: amount },
          },
        });

        return { goal: updatedGoal };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
        timeout: 15000,
      }
    );

    if ("error" in result) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({ ok: true, goal: result.goal });
  } catch (error) {
    console.error("GOAL_DEPOSIT_ERROR", error);

    return NextResponse.json(
      { error: "Не удалось пополнить цель" },
      { status: 500 }
    );
  }
}
