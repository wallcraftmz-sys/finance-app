"use client";

import Link from "next/link";

export default function IncomePage() {
  const totalIncome = 0;
  const incomeItems: Array<{ id: string; title: string; amount: number; date: string }> = [];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "white",
        display: "flex",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "40px 20px 120px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <h1
          style={{
            fontSize: "56px",
            lineHeight: 1,
            margin: "0 0 28px 0",
            fontWeight: 500,
            letterSpacing: "-2px",
          }}
        >
          Доходы
        </h1>

        <div
          style={{
            background: "#111118",
            border: "1px solid #24242c",
            borderRadius: "28px",
            padding: "22px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              color: "#9ea0aa",
              fontSize: "15px",
              marginBottom: "14px",
            }}
          >
            Общая сумма доходов
          </div>

          <div
            style={{
              fontSize: "58px",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-2px",
            }}
          >
            {totalIncome}€
          </div>
        </div>

        <button
          style={{
            width: "100%",
            padding: "20px 22px",
            background: "#f6b117",
            border: "none",
            borderRadius: "24px",
            color: "#111",
            fontWeight: 800,
            fontSize: "22px",
            cursor: "pointer",
            marginBottom: "18px",
          }}
        >
          + Добавить доход
        </button>

        <div
          style={{
            background: "#111118",
            border: "1px solid #24242c",
            borderRadius: "28px",
            padding: "22px",
          }}
        >
          <div
            style={{
              fontSize: "18px",
              fontWeight: 700,
              marginBottom: "16px",
            }}
          >
            Список доходов
          </div>

          {incomeItems.length === 0 ? (
            <div
              style={{
                color: "#8f929c",
                fontSize: "15px",
                lineHeight: 1.6,
              }}
            >
              Пока доходов нет
            </div>
          ) : (
            <div style={{ display: "grid", gap: "12px" }}>
              {incomeItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#181820",
                    border: "1px solid #2a2a33",
                    borderRadius: "18px",
                    padding: "14px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div
                      style={{
                        color: "#8f929c",
                        fontSize: "14px",
                        marginTop: "4px",
                      }}
                    >
                      {item.date}
                    </div>
                  </div>

                  <div
                    style={{
                      fontWeight: 800,
                      fontSize: "22px",
                      color: "#f6b117",
                    }}
                  >
                    +{item.amount}€
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: "18px",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "420px",
            padding: "0 20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              background: "#111118",
              border: "1px solid #2a2a31",
              borderRadius: "22px",
              padding: "16px 14px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link href="/" style={{ color: "#e2e2e8", textDecoration: "none", fontWeight: 500 }}>
              Главная
            </Link>
            <Link href="/analytics" style={{ color: "#e2e2e8", textDecoration: "none", fontWeight: 500 }}>
              Аналитика
            </Link>
            <Link href="/goals" style={{ color: "#e2e2e8", textDecoration: "none", fontWeight: 500 }}>
              Цель
            </Link>
            <span style={{ color: "#f6b117", fontWeight: 700 }}>Доход</span>
            <Link href="/expenses" style={{ color: "#e2e2e8", textDecoration: "none", fontWeight: 500 }}>
              Расход
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}