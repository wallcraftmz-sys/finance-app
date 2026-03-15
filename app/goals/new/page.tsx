"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewGoalPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/goals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          targetAmount: Number(targetAmount),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка создания цели");
        return;
      }

      router.push("/goals");
    } catch (error) {
      setError("Ошибка сети");
    } finally {
      setLoading(false);
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
            placeholder="Название цели"
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
            placeholder="Сумма"
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

          {error ? (
            <div
              style={{
                color: "#ff8a8a",
                fontSize: "14px",
                background: "#2a1414",
                border: "1px solid #5a2a2a",
                padding: "10px 12px",
                borderRadius: "12px",
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              border: "none",
              borderRadius: "16px",
              fontWeight: 800,
              color: "#111",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Сохранение..." : "Сохранить цель"}
          </button>
        </div>
      </div>
    </main>
  );
}