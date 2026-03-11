"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Income = {
  id: string;
  amount: number;
  source: string;
  date: string;
  note: string;
};

const INCOME_KEY = "finance-income";

export default function IncomeListPage() {
  const [income, setIncome] = useState<Income[]>([]);

  useEffect(() => {
    const rawIncome = localStorage.getItem(INCOME_KEY);
    const incomeData: Income[] = rawIncome ? JSON.parse(rawIncome) : [];
    setIncome(incomeData);
  }, []);

  const totalIncome = useMemo(() => {
    return income.reduce((sum, item) => sum + item.amount, 0);
  }, [income]);

  const latestIncome = [...income].reverse();

  function handleDelete(id: string) {
    const updated = income.filter((item) => item.id !== id);
    setIncome(updated);
    localStorage.setItem(INCOME_KEY, JSON.stringify(updated));
  }

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
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Доходы</h1>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "6px" }}>
            Общая сумма доходов
          </div>
          <b style={{ fontSize: "24px" }}>{totalIncome}€</b>
        </div>

        <Link href="/income/new" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "12px",
              background: "#f59e0b",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              marginBottom: "20px",
            }}
          >
            Добавить доход
          </button>
        </Link>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>
            Список доходов
          </h3>

          {latestIncome.length === 0 ? (
            <p style={{ color: "#999", margin: 0 }}>Пока доходов нет</p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {latestIncome.map((item) => (
                <div
                  key={item.id}
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
                      gap: "10px",
                    }}
                  >
                    <b>{item.source}</b>
                    <b style={{ color: "#f59e0b" }}>{item.amount}€</b>
                  </div>

                  <div style={{ fontSize: "13px", color: "#aaa" }}>
                    {item.date}
                  </div>

                  {item.note ? (
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#ccc",
                        marginTop: "6px",
                      }}
                    >
                      {item.note}
                    </div>
                  ) : null}

                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      marginTop: "10px",
                      padding: "8px 10px",
                      background: "#2a2a2a",
                      color: "white",
                      border: "1px solid #3a3a3a",
                      borderRadius: "8px",
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
              color: "#f59e0b",
              textDecoration: "none",
              fontWeight: "bold",
              background: "#1d1d1d",
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