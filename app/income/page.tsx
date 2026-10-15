
"use client";

import BottomNav from "@/components/BottomNav";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Income = {
  id: string;
  amount: number;
  currency: string;
  source: string;
  date: string;
  note: string;
};

export default function IncomePage() {
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadIncomes() {
    try {
      const res = await fetch("/api/income");
      const data = await res.json();

      if (res.ok) {
        setIncomes(data.incomes || []);
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadIncomes();
  }, []);

  const totalIncome = useMemo(() => {
    const totals: Record<string, number> = {};

    for (const item of incomes) {
      const currency = item.currency || "EUR";
      totals[currency] = (totals[currency] || 0) + item.amount;
    }

    return Object.entries(totals)
      .map(([currency, amount]) =>
        new Intl.NumberFormat("ru-RU", {
          style: "currency",
          currency,
        }).format(amount)
      )
      .join(" · ") || "0 €";
  }, [incomes]);

  const sortedIncomes = [...incomes];

  async function handleDelete(id: string) {
    const res = await fetch(`/api/income/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setIncomes((prev) => prev.filter((item) => item.id !== id));
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--moniq-bg)",
        color: "var(--moniq-text)",
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
            background: "var(--moniq-card)",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "18px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "14px", color: "var(--moniq-muted)", marginBottom: "8px" }}>
            Общая сумма доходов
          </div>
          <div style={{ fontSize: "32px", fontWeight: 800 }}>{totalIncome}</div>
        </div>

        <Link href="/income/new" style={{ textDecoration: "none" }}>
          <button
            style={{
              width: "100%",
              padding: "14px",
              background: "var(--moniq-accent)",
              border: "none",
              borderRadius: "18px",
              fontWeight: 800,
              color: "var(--moniq-card)",
              cursor: "pointer",
              marginBottom: "16px",
            }}
          >
            + Добавить доход
          </button>
        </Link>

        <div
          style={{
            background: "var(--moniq-card)",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "18px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>Список доходов</h3>

          {loading ? (
            <p style={{ color: "var(--moniq-muted)", margin: 0 }}>Загрузка...</p>
          ) : sortedIncomes.length === 0 ? (
            <p style={{ color: "var(--moniq-muted)", margin: 0 }}>Пока доходов нет</p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {sortedIncomes.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "var(--moniq-input)",
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
                    <div style={{ fontWeight: 700 }}>{item.source}</div>
                    <div style={{ fontWeight: 700, color: "var(--moniq-accent)" }}>
                      +{new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: item.currency || "EUR",
                      }).format(item.amount)}
                    </div>
                  </div>

                  <div style={{ color: "var(--moniq-muted)", fontSize: "12px", marginBottom: "6px" }}>
                    {item.date}
                  </div>

                  {item.note ? (
                    <div style={{ color: "var(--moniq-muted)", fontSize: "13px", marginBottom: "10px" }}>
                      {item.note}
                    </div>
                  ) : null}

                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      background: "var(--moniq-input)",
                      border: "1px solid #2f2f36",
                      color: "var(--moniq-text)",
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

        <BottomNav />
      </div>
    </main>
  );
}