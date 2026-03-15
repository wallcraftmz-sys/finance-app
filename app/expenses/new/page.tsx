"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewExpensePage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Еда");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!amount || !date) {
      alert("Заполни сумму и дату");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          category,
          date,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ошибка создания расхода");
        return;
      }

      router.push("/expenses");
    } catch (error) {
      alert("Ошибка сети");
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
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "30px",
          background: "#111",
          borderRadius: "16px",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
          Добавить расход
        </h1>

        <div style={{ display: "grid", gap: "12px" }}>
          <input
            type="number"
            placeholder="Сумма"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "#1a1a1a",
              color: "white",
            }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "#1a1a1a",
              color: "white",
            }}
          >
            <option>Еда</option>
            <option>Транспорт</option>
            <option>Жилье</option>
            <option>Подписки</option>
            <option>Развлечения</option>
            <option>Другое</option>
          </select>

          <input
            type="text"
            placeholder="Дата, например 2026-03-11"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "#1a1a1a",
              color: "white",
            }}
          />

          <textarea
            placeholder="Комментарий"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "#1a1a1a",
              color: "white",
              resize: "none",
            }}
          />

          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "#f59e0b",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Сохранение..." : "Сохранить расход"}
          </button>
        </div>
      </div>
    </main>
  );
}