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

type Goal = {
  title: string;
  targetAmount: number;
};

const EXPENSES_KEY = "finance-expenses";
const INCOME_KEY = "finance-income";
const GOAL_KEY = "finance-goal";

export default function GoalsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);

  useEffect(() => {
    const rawExpenses = localStorage.getItem(EXPENSES_KEY);
    const rawIncome = localStorage.getItem(INCOME_KEY);
    const rawGoal = localStorage.getItem(GOAL_KEY);

    const expenseData: Expense[] = rawExpenses ? JSON.parse(rawExpenses) : [];
    const incomeData: Income[] = rawIncome ? JSON.parse(rawIncome) : [];
    const goalData: Goal | null = rawGoal ? JSON.parse(rawGoal) : null;

    setExpenses(expenseData);
    setIncome(incomeData);
    setGoal(goalData);
  }, []);

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return income.reduce((sum, item) => sum + item.amount, 0);
  }, [income]);

  const moneyLeft = totalIncome - totalExpense;

  const goalSaved = Math.max(moneyLeft, 0);
  const goalTarget = goal?.targetAmount ?? 0;
  const goalPercent =
    goalTarget > 0 ? Math.min(Math.round((goalSaved / goalTarget) * 100), 100) : 0;
  const goalRemain = Math.max(goalTarget - goalSaved, 0);

  function handleDeleteGoal() {
    localStorage.removeItem(GOAL_KEY);
    setGoal(null);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "20px 0 90px",
      }}
    >
      <div
        style={{
          width: "390px",
          padding: "18px",
          borderRadius: "24px",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Цели</h1>

        {!goal ? (
          <div
            style={{
              background: "#17171c",
              padding: "18px",
              borderRadius: "22px",
              border: "1px solid #26262b",
            }}
          >
            <p style={{ color: "#c8c8ce", marginTop: 0 }}>
              У тебя пока нет цели. Создай свою первую финансовую цель.
            </p>

            <Link href="/goals/new" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                  border: "none",
                  borderRadius: "16px",
                  fontWeight: 800,
                  color: "#111",
                  cursor: "pointer",
                }}
              >
                + Создать цель
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div
              style={{
                background: "#17171c",
                padding: "18px",
                borderRadius: "22px",
                border: "1px solid #26262b",
                marginBottom: "16px",
              }}
            >
              <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "8px" }}>
                Активная цель
              </div>

              <h2 style={{ margin: "0 0 10px 0", fontSize: "22px" }}>{goal.title}</h2>

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

            <div style={{ display: "grid", gap: "10px" }}>
              <Link href="/goals/new" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%",
                    padding: "14px",
                    background: "#222228",
                    border: "1px solid #2f2f36",
                    borderRadius: "16px",
                    fontWeight: 700,
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  Изменить цель
                </button>
              </Link>

              <button
                onClick={handleDeleteGoal}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "#3a1f1f",
                  border: "1px solid #5a2a2a",
                  borderRadius: "16px",
                  fontWeight: 700,
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Удалить цель
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}