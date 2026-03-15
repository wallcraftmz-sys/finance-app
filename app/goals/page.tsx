"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Goal = {
  id: string;
  title: string;
  targetAmount: number;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadGoals() {
    try {
      const res = await fetch("/api/goals");
      const data = await res.json();

      if (res.ok) {
        setGoals(data.goals || []);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteGoal(id: string) {
    const res = await fetch(`/api/goals/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      setGoals((prev) => prev.filter((goal) => goal.id !== id));
    }
  }

  useEffect(() => {
    loadGoals();
  }, []);

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
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>Цели</h1>

        {loading ? (
          <div>Загрузка...</div>
        ) : goals.length === 0 ? (
          <div
            style={{
              background: "#17171c",
              padding: "18px",
              borderRadius: "22px",
              border: "1px solid #26262b",
            }}
          >
            <p style={{ color: "#c8c8ce", marginTop: 0 }}>
              У тебя пока нет цели. Создай свою первую финансовую цель.
            </p>

            <Link href="/goals/new" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                  border: "none",
                  borderRadius: "16px",
                  fontWeight: 800,
                  color: "#111",
                  cursor: "pointer",
                }}
              >
                + Создать цель
              </button>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "14px" }}>
            {goals.map((goal) => (
              <div
                key={goal.id}
                style={{
                  background: "#17171c",
                  padding: "18px",
                  borderRadius: "22px",
                  border: "1px solid #26262b",
                }}
              >
                <div style={{ fontSize: "14px", color: "#aaa", marginBottom: "8px" }}>
                  Активная цель
                </div>

                <h2 style={{ margin: "0 0 10px 0", fontSize: "22px" }}>{goal.title}</h2>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "14px",
                  }}
                >
                  <span>Цель</span>
                  <b>{goal.targetAmount}€</b>
                </div>

                <div style={{ display: "grid", gap: "10px" }}>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    style={{
                      width: "100%",
                      padding: "14px",
                      background: "#3a1f1f",
                      border: "1px solid #5a2a2a",
                      borderRadius: "16px",
                      fontWeight: 700,
                      color: "white",
                      cursor: "pointer",
                    }}
                  >
                    Удалить цель
                  </button>
                </div>
              </div>
            ))}

            <Link href="/goals/new" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                  border: "none",
                  borderRadius: "16px",
                  fontWeight: 800,
                  color: "#111",
                  cursor: "pointer",
                }}
              >
                + Создать ещё цель
              </button>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}