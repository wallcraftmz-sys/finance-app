"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
};

const LS_KEY = "finance-expenses";

export default function NewExpensePage() {
  const router = useRouter();

  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Еда");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  function handleSave() {
    if (!amount || !date) {
      alert("Заполни сумму и дату");
      return;
    }

    const newExpense: Expense = {
      id: crypto.randomUUID(),
      amount: Number(amount),
      category,
      date,
      note,
    };

    const raw = localStorage.getItem(LS_KEY);
    const current: Expense[] = raw ? JSON.parse(raw) : [];

    current.push(newExpense);
    localStorage.setItem(LS_KEY, JSON.stringify(current));

    router.push("/");
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
            style={{
              width: "100%",
              padding: "12px",
              background: "#f59e0b",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Сохранить расход
          </button>
        </div>
      </div>
    </main>
  );
}