"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Goal = {
  title: string;
  targetAmount: number;
};

const GOAL_KEY = "finance-goal";

export default function NewGoalPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  function handleSave() {
    if (!title || !targetAmount) {
      alert("Заполни название цели и сумму");
      return;
    }

    const goal: Goal = {
      title,
      targetAmount: Number(targetAmount),
    };

    localStorage.setItem(GOAL_KEY, JSON.stringify(goal));
    router.push("/goals");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "390px",
          background: "#17171c",
          border: "1px solid #26262b",
          borderRadius: "22px",
          padding: "22px",
        }}
      >
        <h1 style={{ fontSize: "28px", marginTop: 0, marginBottom: "18px" }}>
          Новая цель
        </h1>

        <div style={{ display: "grid", gap: "12px" }}>
          <input
            type="text"
            placeholder="Название цели, например Ноутбук"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid #333",
              background: "#111114",
              color: "white",
            }}
          />

          <input
            type="number"
            placeholder="Сумма, например 2000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            style={{
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid #333",
              background: "#111114",
              color: "white",
            }}
          />

          <button
            onClick={handleSave}
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
            Сохранить цель
          </button>
        </div>
      </div>
    </main>
  );
}