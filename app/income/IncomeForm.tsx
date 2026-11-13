"use client";

import TransactionDateField from "@/components/TransactionDateField";
import { dateForInput } from "@/lib/transaction-date";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Income = {
  id: string;
  amount: number;
  currency: string;
  source: string;
  date: string;
  note: string;
};

export default function IncomeForm({ income }: { income?: Income }) {
  const router = useRouter();

  const [amount, setAmount] = useState(income ? String(income.amount) : "");
  const [source, setSource] = useState(income?.source ?? "Зарплата");
  const [date, setDate] = useState(income ? dateForInput(income.date) : "");
  const [note, setNote] = useState(income?.note ?? "");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!amount || !date) {
      alert("Заполни сумму и дату");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(income ? `/api/income/${income.id}` : "/api/income", {
        method: income ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Number(amount),
          source,
          date,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Не удалось сохранить доход");
        return;
      }

      router.push("/income");
      router.refresh();
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
        background: "var(--moniq-bg)",
        color: "var(--moniq-text)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
        padding: "16px",
      }}
    >
      <div
        style={{
          width: "min(380px, 100%)",
          boxSizing: "border-box",
          padding: "24px",
          background: "var(--moniq-card)",
          borderRadius: "16px",
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/income")}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--moniq-accent)",
            cursor: "pointer",
            padding: "0",
            marginBottom: "20px",
            fontSize: "15px",
            fontWeight: 600,
          }}
        >
          ← Назад к доходам
        </button>

        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>
          {income ? "Изменить доход" : "Добавить доход"}
        </h1>

        <div style={{ display: "grid", gap: "12px" }}>
          <input
            type="number"
            placeholder="Сумма"
            aria-label={income ? `Сумма (${income.currency || "EUR"})` : "Сумма"}
            inputMode="decimal"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "var(--moniq-input)",
              color: "var(--moniq-text)",
            }}
          />

          <select
            aria-label="Источник"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "var(--moniq-input)",
              color: "var(--moniq-text)",
            }}
          >
            {income && !["Зарплата", "Подработка", "Подарок", "Возврат", "Другое"].includes(income.source) && (
              <option>{income.source}</option>
            )}
            <option>Зарплата</option>
            <option>Подработка</option>
            <option>Подарок</option>
            <option>Возврат</option>
            <option>Другое</option>
          </select>

          <TransactionDateField value={date} onChange={setDate} />

          <textarea
            placeholder="Комментарий"
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "var(--moniq-input)",
              color: "var(--moniq-text)",
              resize: "none",
            }}
          />

          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              background: "var(--moniq-accent)",
              border: "none",
              borderRadius: "10px",
              fontWeight: "bold",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Сохранение..." : "Сохранить доход"}
          </button>
        </div>
      </div>
    </main>
  );
}
