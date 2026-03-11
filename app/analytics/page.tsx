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
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Аналитика</h1>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "6px" }}>
            Общая сумма расходов
          </div>
          <b style={{ fontSize: "24px" }}>{totalExpense}€</b>
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>
            Круговая диаграмма
          </h3>

          {categoryTotals.length === 0 ? (
            <p style={{ color: "#999", margin: 0 }}>Пока данных нет</p>
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
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>
            Последние расходы по датам
          </h3>

          {latestByDate.length === 0 ? (
            <p style={{ color: "#999", margin: 0 }}>Пока данных нет</p>
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
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>
            Расходы по категориям
          </h3>

          {categoryTotals.length === 0 ? (
            <p style={{ color: "#999", margin: 0 }}>Пока аналитики нет</p>
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
                      padding: "12px",
                      background: "#111",
                      borderRadius: "10px",
                      border: "1px solid #2a2a2a",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <b>{item.category}</b>
                      <b>{item.amount}€</b>
                    </div>

                    <div
                      style={{
                        height: "8px",
                        background: "#2a2a2a",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: "#f59e0b",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "12px",
                        color: "#aaa",
                      }}
                    >
                      {percent}% от всех расходов
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
              color: "#f59e0b",
              textDecoration: "none",
              fontWeight: "bold",
              background: "#1d1d1d",
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