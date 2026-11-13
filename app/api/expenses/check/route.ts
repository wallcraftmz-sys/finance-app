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
    const expenseId = typeof body?.expenseId === "string" ? body.expenseId : undefined;

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

    const primaryCurrency = isCurrency(user.currency)
      ? user.currency
      : "EUR";

    const existingExpense = expenseId
      ? await prisma.expense.findFirst({
          where: { id: expenseId, userId: user.id },
          select: { currency: true },
        })
      : null;

    if (expenseId && !existingExpense) {
      return NextResponse.json({ error: "Расход не найден" }, { status: 404 });
    }

    const expenseCurrency = existingExpense ? existingExpense.currency || "EUR" : primaryCurrency;
    if (!isCurrency(expenseCurrency)) {
      return NextResponse.json({ error: "Валюта расхода не поддерживается" }, { status: 400 });
    }

    const rates = await getExchangeRates();
    const convertedAmount = convertCurrency(amount, expenseCurrency, primaryCurrency, rates.rates);

    const [incomes, expenses, goals] = await Promise.all([
      prisma.income.findMany({
        where: { userId: user.id },
        select: { amount: true, currency: true },
      }),
      prisma.expense.findMany({
        where: { userId: user.id, ...(expenseId ? { id: { not: expenseId } } : {}) },
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
          primaryCurrency,
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
      currency: primaryCurrency,
      available,
      amount: convertedAmount,
      afterExpense: available - convertedAmount,
      warning: convertedAmount > available + 0.000001,
    });
  } catch (error) {
    console.error("EXPENSE_CHECK_ERROR", error);

    return NextResponse.json(
      { error: "Не удалось проверить доступный баланс" },
      { status: 500 }
    );
  }
}
