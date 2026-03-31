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

type Props = {
  expenses: Expense[];
  incomes: Income[];
  goals: Goal[];
};

export default function DashboardClient({ expenses, incomes, goals }: Props) {
  const [aiAdvice, setAiAdvice] = useState("Анализирую твои финансы...");

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return incomes.reduce((sum, item) => sum + item.amount, 0);
  }, [incomes]);

  const moneyLeft = totalIncome - totalExpense;
  const latestExpenses = [...expenses].slice(0, 4);
  const goal = goals[0] ?? null;

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};

    for (const item of expenses) {
      if (!map[item.category]) {
        map[item.category] = 0;
      }
      map[item.category] += item.amount;
    }

    return Object.entries(map)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  useEffect(() => {
    async function loadAdvice() {
      try {
        const res = await fetch("/api/ai-advice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            income: totalIncome,
            expense: totalExpense,
            categories: categoryTotals,
          }),
        });

        const data = await res.json();

        if (res.ok && data.advice) {
          setAiAdvice(data.advice);
          return;
        }

        setAiAdvice("Пока не удалось построить совет. Добавь ещё немного данных.");
      } catch {
        setAiAdvice("Пока не удалось подключить финансовый совет. Попробуй позже.");
      }
    }

    loadAdvice();
  }, [totalIncome, totalExpense, categoryTotals]);

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    localStorage.removeItem("finance-user");
    window.location.href = "/login";
  }

  const goalSaved = Math.max(moneyLeft, 0);
  const goalTarget = goal?.targetAmount ?? 0;
  const goalPercent =
    goalTarget > 0 ? Math.min(Math.round((goalSaved / goalTarget) * 100), 100) : 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b0b0f 0%, #111111 100%)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "20px 0 96px",
      }}
    >
      <div
        style={{
          width: "390px",
          padding: "18px",
          borderRadius: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <div style={{ fontSize: "13px", color: "#8f8f95", marginBottom: "4px" }}>
              Moniq
            </div>
            <h1 style={{ fontSize: "28px", margin: 0, fontWeight: 700 }}>
              Главная
            </h1>
          </div>

          <button
            onClick={handleLogout}
            style={{
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid #333",
              background: "#111",
              color: "white",
              cursor: "pointer",
              fontWeight: 700,
            }}
          >
            Выйти
          </button>
        </div>

        <section
          style={{
            background: "linear-gradient(135deg, #1c1c22 0%, #111114 100%)",
            border: "1px solid #26262b",
            borderRadius: "24px",
            padding: "22px",
            marginBottom: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ color: "#9898a3", fontSize: "13px", marginBottom: "8px" }}>
            Текущий остаток
          </div>

          <div
            style={{
              fontSize: "40px",
              fontWeight: 800,
              letterSpacing: "-1px",
              marginBottom: "16px",
            }}
          >
            {moneyLeft}€
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            <div
              style={{
                background: "#15151a",
                border: "1px solid #24242a",
                borderRadius: "18px",
                padding: "12px",
              }}
            >
              <div style={{ color: "#8f8f95", fontSize: "12px", marginBottom: "6px" }}>
                Доход
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px" }}>{totalIncome}€</div>
            </div>

            <div
              style={{
                background: "#15151a",
                border: "1px solid #24242a",
                borderRadius: "18px",
                padding: "12px",
              }}
            >
              <div style={{ color: "#8f8f95", fontSize: "12px", marginBottom: "6px" }}>
                Расход
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px" }}>{totalExpense}€</div>
            </div>

            <div
              style={{
                background: "#15151a",
                border: "1px solid #24242a",
                borderRadius: "18px",
                padding: "12px",
              }}
            >
              <div style={{ color: "#8f8f95", fontSize: "12px", marginBottom: "6px" }}>
                Баланс
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px", color: "#fbbf24" }}>
                {moneyLeft}€
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <Link href="/income" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "#17171c",
                border: "1px solid #26262b",
                borderRadius: "20px",
                padding: "16px",
                color: "white",
              }}
            >
              <div style={{ fontSize: "13px", color: "#8f8f95", marginBottom: "6px" }}>
                Быстрое действие
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>Доходы</div>
            </div>
          </Link>

          <Link href="/expenses/new" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                borderRadius: "20px",
                padding: "16px",
                color: "#111",
              }}
            >
              <div style={{ fontSize: "13px", opacity: 0.8, marginBottom: "6px" }}>
                Быстрое действие
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800 }}>+ Расход</div>
            </div>
          </Link>
        </section>

        <section
          style={{
            background: "#17171c",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "18px",
            marginBottom: "16px",
          }}
        >
          {!goal ? (
            <>
              <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>
                Финансовая цель
              </div>
              <div style={{ color: "#8f8f95", fontSize: "14px", marginBottom: "12px" }}>
                У тебя пока нет цели. Создай её, чтобы видеть прогресс прямо на главной.
              </div>

              <Link href="/goals/new" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                    border: "none",
                    borderRadius: "14px",
                    fontWeight: 800,
                    color: "#111",
                    cursor: "pointer",
                  }}
                >
                  + Создать цель
                </button>
              </Link>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "16px", fontWeight: 700 }}>{goal.title}</div>
                <div style={{ fontSize: "13px", color: "#a0a0a8" }}>
                  {goalSaved}€ / {goalTarget}€
                </div>
              </div>

              <div
                style={{
                  height: "10px",
                  background: "#26262b",
                  borderRadius: "999px",
                  overflow: "hidden",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: `${goalPercent}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
                  }}
                />
              </div>

              <div style={{ color: "#8f8f95", fontSize: "12px" }}>
                Прогресс: {goalPercent}%
              </div>
            </>
          )}
        </section>

        <section
          style={{
            background: "#17171c",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "18px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>
            Последние расходы
          </div>

          {latestExpenses.length === 0 ? (
            <div style={{ color: "#8f8f95", fontSize: "14px" }}>Пока расходов нет</div>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {latestExpenses.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#111114",
                    border: "1px solid #24242a",
                    borderRadius: "18px",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{item.category}</div>
                    <div style={{ fontWeight: 700, color: "#fbbf24" }}>
                      {item.amount}€
                    </div>
                  </div>

                  <div style={{ color: "#8f8f95", fontSize: "12px", marginBottom: "6px" }}>
                    {item.date}
                  </div>

                  {item.note ? (
                    <div style={{ color: "#c8c8ce", fontSize: "13px", marginBottom: "10px" }}>
                      {item.note}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <div
          style={{
            position: "fixed",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "390px",
            background: "rgba(20,20,24,0.95)",
            border: "1px solid #2a2a30",
            borderRadius: "22px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            overflow: "hidden",
            backdropFilter: "blur(12px)",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "#fbbf24",
              textDecoration: "none",
              fontWeight: 700,
              background: "#1a1a20",
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
              color: "white",
              textDecoration: "none",
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
            href="/expenses"
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