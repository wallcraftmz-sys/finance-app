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
  id: string;
  title: string;
  targetAmount: number;
};

const EXPENSES_KEY = "finance-expenses";
const INCOME_KEY = "finance-income";
const GOAL_KEY = "finance-goals";

export default function GoalsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const rawExpenses = localStorage.getItem(EXPENSES_KEY);
    const rawIncome = localStorage.getItem(INCOME_KEY);
    const rawGoals = localStorage.getItem(GOAL_KEY);

    const expenseData: Expense[] = rawExpenses ? JSON.parse(rawExpenses) : [];
    const incomeData: Income[] = rawIncome ? JSON.parse(rawIncome) : [];
    const goalsData: Goal[] = rawGoals ? JSON.parse(rawGoals) : [];

    setExpenses(expenseData);
    setIncome(incomeData);
    setGoals(goalsData);
  }, []);

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return income.reduce((sum, item) => sum + item.amount, 0);
  }, [income]);

  const moneyLeft = totalIncome - totalExpense;

  function handleDeleteGoal(id: string) {
    const updatedGoals = goals.filter((goal) => goal.id !== id);
    setGoals(updatedGoals);
    localStorage.setItem(GOAL_KEY, JSON.stringify(updatedGoals));
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
          position: "relative",
        }}
      >
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          style={{
            position: "absolute",
            top: "18px",
            right: "18px",
            padding: "10px 14px",
            borderRadius: "12px",
            border: "1px solid #333",
            background: "#111",
            color: "white",
            cursor: "pointer",
          }}
        >
          Выйти
        </button>

        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Цели</h1>

        {goals.length === 0 ? (
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
          <div style={{ display: "grid", gap: "14px" }}>
            {goals.map((goal) => {
              const goalSaved = Math.max(moneyLeft, 0);
              const goalTarget = goal.targetAmount;
              const goalPercent =
                goalTarget > 0
                  ? Math.min(Math.round((goalSaved / goalTarget) * 100), 100)
                  : 0;
              const goalRemain = Math.max(goalTarget - goalSaved, 0);

              return (
                <div
                  key={goal.id}
                  style={{
                    background: "#17171c",
                    padding: "18px",
                    borderRadius: "22px",
                    border: "1px solid #26262b",
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
                      marginBottom: "14px",
                    }}
                  >
                    Прогресс: {goalPercent}%
                  </div>

                  <div style={{ display: "grid", gap: "10px" }}>
                    <Link href="/dashboard" style={{ textDecoration: "none" }}>
                      <button
                        style={{
                          width: "100%",
                          padding: "14px",
                          background: "#1f1f26",
                          border: "1px solid #2f2f36",
                          borderRadius: "16px",
                          fontWeight: 700,
                          color: "white",
                          cursor: "pointer",
                        }}
                      >
                        Назад
                      </button>
                    </Link>

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
                        Добавить ещё цель
                      </button>
                    </Link>

                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
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
                </div>
              );
            })}

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
                + Создать ещё цель
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}