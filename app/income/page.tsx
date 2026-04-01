"use client";

import Link from "next/link";

type IncomeItem = {
  id: string;
  title: string;
  amount: number;
  date: string;
};

export default function IncomePage() {
  const totalIncome = 0;
  const incomeItems: IncomeItem[] = [];

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
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Доходы</h1>

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
            Общая сумма доходов
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800 }}>{totalIncome}€</div>
        </div>

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
          + Добавить доход
        </button>

        <div
          style={{
            background: "#17171c",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "18px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>Список доходов</h3>

          {incomeItems.length === 0 ? (
            <p style={{ color: "#8f8f95", margin: 0 }}>Пока доходов нет</p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {incomeItems.map((item) => (
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
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div style={{ fontWeight: 700, color: "#fbbf24" }}>
                      +{item.amount}€
                    </div>
                  </div>

                  <div style={{ color: "#8f8f95", fontSize: "12px" }}>
                    {item.date}
                  </div>
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
              color: "#fbbf24",
              textDecoration: "none",
              fontWeight: 700,
              background: "#1a1a20",
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