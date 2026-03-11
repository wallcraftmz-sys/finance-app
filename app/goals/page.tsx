"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
};

type Income = {
  id: string;
  amount: number;
  source: string;
  date: string;
  note: string;
};

const EXPENSES_KEY = "finance-expenses";
const INCOME_KEY = "finance-income";

export default function GoalsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);

  useEffect(() => {
    const rawExpenses = localStorage.getItem(EXPENSES_KEY);
    const rawIncome = localStorage.getItem(INCOME_KEY);

    const expenseData: Expense[] = rawExpenses ? JSON.parse(rawExpenses) : [];
    const incomeData: Income[] = rawIncome ? JSON.parse(rawIncome) : [];

    setExpenses(expenseData);
    setIncome(incomeData);
  }, []);

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return income.reduce((sum, item) => sum + item.amount, 0);
  }, [income]);

  const moneyLeft = totalIncome - totalExpense;

  const goalName = "Резервный фонд";
  const goalTarget = 2000;
  const goalSaved = Math.max(moneyLeft, 0);
  const goalPercent =
    goalTarget > 0 ? Math.min(Math.round((goalSaved / goalTarget) * 100), 100) : 0;
  const goalRemain = Math.max(goalTarget - goalSaved, 0);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        fontFamily: "sans-serif",
        padding: "20px 0 90px",
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "30px",
          background: "#111",
          borderRadius: "16px",
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Цели</h1>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "8px" }}>
            Активная цель
          </div>

          <h2 style={{ margin: "0 0 10px 0", fontSize: "22px" }}>{goalName}</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              gap: "10px",
            }}
          >
            <span>Накоплено</span>
            <b>{goalSaved}€</b>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
              gap: "10px",
            }}
          >
            <span>Цель</span>
            <b>{goalTarget}€</b>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "14px",
              gap: "10px",
            }}
          >
            <span>Осталось накопить</span>
            <b>{goalRemain}€</b>
          </div>

          <div
            style={{
              height: "10px",
              background: "#2a2a2a",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${goalPercent}%`,
                height: "100%",
                background: "#f59e0b",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#aaa",
            }}
          >
            Прогресс: {goalPercent}%
          </div>
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "12px" }}>Подсказка</h3>
          <p style={{ margin: 0, color: "#ccc", lineHeight: 1.6 }}>
            Сейчас цель считается от свободного остатка после расходов. Потом мы
            сделаем отдельное создание целей и ручное пополнение накоплений.
          </p>
        </div>

        <div
          style={{
            position: "fixed",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "380px",
            background: "#161616",
            border: "1px solid #2a2a2a",
            borderRadius: "16px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            overflow: "hidden",
          }}
        >
          <Link
            href="/"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            Главная
          </Link>

          <Link
            href="/analytics"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            Аналитика
          </Link>

          <Link
            href="/goals"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "#f59e0b",
              textDecoration: "none",
              fontWeight: "bold",
              background: "#1d1d1d",
            }}
          >
            Цель
          </Link>

          <Link
            href="/income"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            Доход
          </Link>

          <Link
            href="/expenses/new"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            Расход
          </Link>
        </div>
      </div>
    </main>
  );
}