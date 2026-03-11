"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
};

const EXPENSES_KEY = "finance-expenses";

const COLORS = ["#f59e0b", "#6366f1", "#10b981", "#ef4444", "#06b6d4", "#a855f7"];

export default function AnalyticsPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const rawExpenses = localStorage.getItem(EXPENSES_KEY);
    const expenseData: Expense[] = rawExpenses ? JSON.parse(rawExpenses) : [];
    setExpenses(expenseData);
  }, []);

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

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

  const latestByDate = useMemo(() => {
    return [...expenses]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7)
      .map((item) => ({
        date: item.date.slice(5),
        amount: item.amount,
      }));
  }, [expenses]);

  const topCategory = categoryTotals[0];

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
              FinTrack
            </div>
            <h1 style={{ fontSize: "28px", margin: 0, fontWeight: 700 }}>
              Analytics
            </h1>
          </div>

          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              color: "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
            }}
          >
            A
          </div>
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
            Общие расходы
          </div>

          <div
            style={{
              fontSize: "40px",
              fontWeight: 800,
              letterSpacing: "-1px",
              marginBottom: "16px",
            }}
          >
            {totalExpense}€
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div
              style={{
                background: "#15151a",
                border: "1px solid #24242a",
                borderRadius: "18px",
                padding: "12px",
              }}
            >
              <div style={{ color: "#8f8f95", fontSize: "12px", marginBottom: "6px" }}>
                Категорий
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px" }}>
                {categoryTotals.length}
              </div>
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
                Топ категория
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px", color: "#fbbf24" }}>
                {topCategory ? topCategory.category : "—"}
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
          <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>
            Круговая диаграмма
          </div>

          {categoryTotals.length === 0 ? (
            <div style={{ color: "#8f8f95", fontSize: "14px" }}>Пока данных нет</div>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryTotals}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={85}
                    label={({ name, percent }) =>
                      `${name} ${Math.round((percent ?? 0) * 100)}%`
                    }
                  >
                    {categoryTotals.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
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
            Расходы по датам
          </div>

          {latestByDate.length === 0 ? (
            <div style={{ color: "#8f8f95", fontSize: "14px" }}>Пока данных нет</div>
          ) : (
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={latestByDate}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="date" stroke="#aaa" />
                  <YAxis stroke="#aaa" />
                  <Tooltip />
                  <Bar dataKey="amount" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
            Категории расходов
          </div>

          {categoryTotals.length === 0 ? (
            <div style={{ color: "#8f8f95", fontSize: "14px" }}>Пока аналитики нет</div>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {categoryTotals.map((item) => {
                const percent =
                  totalExpense > 0
                    ? Math.round((item.amount / totalExpense) * 100)
                    : 0;

                return (
                  <div
                    key={item.category}
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
                        marginBottom: "8px",
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{item.category}</div>
                      <div style={{ fontWeight: 700, color: "#fbbf24" }}>
                        {item.amount}€
                      </div>
                    </div>

                    <div
                      style={{
                        height: "8px",
                        background: "#26262b",
                        borderRadius: "999px",
                        overflow: "hidden",
                        marginBottom: "6px",
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
                        }}
                      />
                    </div>

                    <div style={{ color: "#8f8f95", fontSize: "12px" }}>
                      {percent}% от всех расходов
                    </div>
                  </div>
                );
              })}
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