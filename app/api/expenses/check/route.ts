import { NextResponse } from "next/server";
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

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

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
        { error: "Введите корректную положительную сумму" },
        { status: 400 }
      );
    }

    const currency = isCurrency(user.currency)
      ? user.currency
      : "EUR";

    const rates = await getExchangeRates();

    const [incomes, expenses, goals] = await Promise.all([
      prisma.income.findMany({
        where: { userId: user.id },
        select: { amount: true, currency: true },
      }),
      prisma.expense.findMany({
        where: { userId: user.id },
        select: { amount: true, currency: true },
      }),
      prisma.goal.findMany({
        where: { userId: user.id },
        select: { savedAmount: true, currency: true },
      }),
    ]);

    function total(
      items: { amount: number; currency: string }[]
    ) {
      let sum = 0;

      for (const item of items) {
        const from = item.currency || "EUR";

        if (!isCurrency(from)) {
          throw new Error("UNSUPPORTED_CURRENCY");
        }

        sum += convertCurrency(
          item.amount,
          from,
          currency,
          rates.rates
        );
      }

      return sum;
    }

    const incomeTotal = total(incomes);
    const expenseTotal = total(expenses);
    const reservedTotal = total(
      goals.map((goal) => ({
        amount: goal.savedAmount,
        currency: goal.currency,
      }))
    );

    const available = incomeTotal - expenseTotal - reservedTotal;

    return NextResponse.json({
      ok: true,
      currency,
      available,
      amount,
      afterExpense: available - amount,
      warning: amount > available + 0.000001,
    });
  } catch (error) {
    console.error("EXPENSE_CHECK_ERROR", error);

    return NextResponse.json(
      { error: "Не удалось проверить доступный баланс" },
      { status: 500 }
    );
  }
}
