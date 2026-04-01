"use client";

import Link from "next/link";

export default function IncomePage() {
  const totalIncome = 0;
  const incomeItems: Array<{ id: string; title: string; amount: number; date: string }> = [];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b0b0f 0%, #111111 100%)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "24px 20px 120px",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "18px",
          }}
        >
          <div>
            <div style={{ color: "#9d9da6", fontSize: "14px", marginBottom: "8px" }}>
              Moniq
            </div>
            <h1
              style={{
                fontSize: "48px",
                lineHeight: 1,
                margin: 0,
                fontWeight: 800,
                letterSpacing: "-1.5px",
              }}
            >
              Доходы
            </h1>
          </div>

          <Link href="/" style={{ textDecoration: "none" }}>
            <button
              style={{
                background: "#111114",
                border: "1px solid #2a2a31",
                color: "white",
                borderRadius: "18px",
                padding: "14px 18px",
                fontWeight: 700,
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              Назад
            </button>
          </Link>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #1c1c22 0%, #111114 100%)",
            border: "1px solid #26262b",
            borderRadius: "28px",
            padding: "22px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
            marginBottom: "16px",
          }}
        >
          <div style={{ color: "#9d9da6", fontSize: "15px", marginBottom: "12px" }}>
            Общая сумма доходов
          </div>

          <div
            style={{
              fontSize: "56px",
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: "-2px",
              marginBottom: "18px",
            }}
          >
            {totalIncome}€
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div
              style={{
                background: "#15151a",
                border: "1px solid #24242a",
                borderRadius: "18px",
                padding: "14px",
              }}
            >
              <div style={{ color: "#9d9da6", fontSize: "14px", marginBottom: "6px" }}>
                Записей
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800 }}>{incomeItems.length}</div>
            </div>

            <div
              style={{
                background: "#15151a",
                border: "1px solid #24242a",
                borderRadius: "18px",
                padding: "14px",
              }}
            >
              <div style={{ color: "#9d9da6", fontSize: "14px", marginBottom: "6px" }}>
                Средний доход
              </div>
              <div style={{ fontSize: "28px", fontWeight: 800, color: "#fbbf24" }}>
                0€
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gap: "12px", marginBottom: "16px" }}>
          <button
            style={{
              width: "100%",
              padding: "18px",
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              border: "none",
              borderRadius: "20px",
              color: "#111",
              fontWeight: 800,
              fontSize: "28px",
              textAlign: "left",
              cursor: "pointer",
              boxShadow: "0 14px 30px rgba(245, 158, 11, 0.22)",
            }}
          >
            <div style={{ fontSize: "15px", marginBottom: "6px", opacity: 0.8 }}>
              Быстрое действие
            </div>
            + Добавить доход
          </button>
        </div>

        <div
          style={{
            background: "linear-gradient(135deg, #1c1c22 0%, #111114 100%)",
            border: "1px solid #26262b",
            borderRadius: "28px",
            padding: "20px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.28)",
            marginBottom: "18px",
          }}
        >
          <div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "12px" }}>
            Список доходов
          </div>

          {incomeItems.length === 0 ? (
            <div
              style={{
                color: "#9d9da6",
                background: "#15151a",
                border: "1px solid #24242a",
                borderRadius: "18px",
                padding: "16px",
                lineHeight: 1.6,
              }}
            >
              Пока доходов нет. Добавь первую запись, чтобы видеть статистику здесь.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {incomeItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "#15151a",
                    border: "1px solid #24242a",
                    borderRadius: "18px",
                    padding: "14px 16px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.title}</div>
                    <div style={{ color: "#9d9da6", fontSize: "14px", marginTop: "4px" }}>
                      {item.date}
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: "22px", color: "#fbbf24" }}>
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
              background: "rgba(17,17,20,0.94)",
              border: "1px solid #2a2a31",
              borderRadius: "22px",
              padding: "14px 12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backdropFilter: "blur(12px)",
            }}
          >
            <Link href="/" style={{ color: "#d6d6dd", textDecoration: "none", fontWeight: 700 }}>
              Главная
            </Link>
            <Link href="/analytics" style={{ color: "#d6d6dd", textDecoration: "none", fontWeight: 700 }}>
              Аналитика
            </Link>
            <Link href="/goals" style={{ color: "#d6d6dd", textDecoration: "none", fontWeight: 700 }}>
              Цель
            </Link>
            <span style={{ color: "#fbbf24", fontWeight: 800 }}>Доход</span>
            <Link href="/expenses" style={{ color: "#d6d6dd", textDecoration: "none", fontWeight: 700 }}>
              Расход
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}