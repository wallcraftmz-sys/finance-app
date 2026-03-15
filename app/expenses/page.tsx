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

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadExpenses() {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();

      if (res.ok) {
        setExpenses(data.expenses || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const sortedExpenses = [...expenses];

  async function handleDelete(id: string) {
    const res = await fetch(`/api/expenses/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setExpenses((prev) => prev.filter((item) => item.id !== id));
    }
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
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Расходы</h1>

        <div
          style={{
            background: "#17171c",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "18px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#8f8f95", marginBottom: "8px" }}>
            Общая сумма расходов
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800 }}>{totalExpense}€</div>
        </div>

        <Link href="/expenses/new" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              border: "none",
              borderRadius: "18px",
              fontWeight: 800,
              color: "#111",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            + Добавить расход
          </button>
        </Link>

        <div
          style={{
            background: "#17171c",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "18px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>Список расходов</h3>

          {loading ? (
            <p style={{ color: "#8f8f95", margin: 0 }}>Загрузка...</p>
          ) : sortedExpenses.length === 0 ? (
            <p style={{ color: "#8f8f95", margin: 0 }}>Пока расходов нет</p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {sortedExpenses.map((item) => (
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

                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      background: "#222228",
                      border: "1px solid #2f2f36",
                      color: "white",
                      borderRadius: "12px",
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

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
              color: "#fbbf24",
              textDecoration: "none",
              fontWeight: 700,
              background: "#1a1a20",
            }}
          >
            Расход
          </Link>
        </div>
      </div>
    </main>
  );
}