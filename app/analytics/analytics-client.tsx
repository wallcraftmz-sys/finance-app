"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

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

type Props = {
  expenses: Expense[];
  incomes: Income[];
};

const COLORS = ["#fbbf24", "#f59e0b", "#fcd34d", "#facc15", "#fde68a", "#ca8a04"];

export default function AnalyticsClient({ expenses, incomes }: Props) {
  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return incomes.reduce((sum, item) => sum + item.amount, 0);
  }, [incomes]);

  const balance = totalIncome - totalExpense;

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};

    for (const item of expenses) {
      if (!map[item.category]) {
        map[item.category] = 0;
      }
      map[item.category] += item.amount;
    }

    return Object.entries(map)
      .map(([category, amount]) => ({
        category,
        amount,
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

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
        <h1 style={{ fontSize: "28px", marginBottom: "18px" }}>Аналитика</h1>

        <section
          style={{
            background: "#17171c",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "18px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
            <div
              style={{
                background: "#111114",
                border: "1px solid #24242a",
                borderRadius: "16px",
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
                background: "#111114",
                border: "1px solid #24242a",
                borderRadius: "16px",
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
                background: "#111114",
                border: "1px solid #24242a",
                borderRadius: "16px",
                padding: "12px",
              }}
            >
              <div style={{ color: "#8f8f95", fontSize: "12px", marginBottom: "6px" }}>
                Баланс
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px", color: "#fbbf24" }}>
                {balance}€
              </div>
            </div>
          </div>
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
          <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>
            Расходы по категориям
          </div>

          {categoryTotals.length === 0 ? (
            <div style={{ color: "#8f8f95", fontSize: "14px" }}>
              Пока нет расходов для аналитики
            </div>
          ) : (
            <>
              <div style={{ width: "100%", height: "260px", marginBottom: "14px" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryTotals}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                    >
                      {categoryTotals.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                {categoryTotals.map((item, index) => (
                  <div
                    key={item.category}
                    style={{
                      background: "#111114",
                      border: "1px solid #24242a",
                      borderRadius: "16px",
                      padding: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "999px",
                          background: COLORS[index % COLORS.length],
                        }}
                      />
                      <div style={{ fontWeight: 600 }}>{item.category}</div>
                    </div>

                    <div style={{ color: "#fbbf24", fontWeight: 700 }}>{item.amount}€</div>
                  </div>
                ))}
              </div>
            </>
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
              color: "#fbbf24",
              textDecoration: "none",
              fontWeight: 700,
              background: "#1a1a20",
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