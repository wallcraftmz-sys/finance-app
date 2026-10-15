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

      router.push("/dashboard");
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
        background: "var(--moniq-bg)",
        color: "var(--moniq-text)",
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
          background: "var(--moniq-card)",
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
              background: "var(--moniq-input)",
              color: "var(--moniq-text)",
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
              background: "var(--moniq-input)",
              color: "var(--moniq-text)",
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
              background: "var(--moniq-accent)",
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