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

    const expenseAmount = Number(amount);

    if (
      !Number.isFinite(expenseAmount) ||
      expenseAmount <= 0 ||
      Math.abs(expenseAmount * 100 - Math.round(expenseAmount * 100)) > 1e-7
    ) {
      alert("Введите положительную сумму с точностью до двух знаков");
      return;
    }

    try {
      setLoading(true);

      const checkRes = await fetch("/api/expenses/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: expenseAmount }),
      });

      const checkData = await checkRes.json();

      if (!checkRes.ok) {
        alert(checkData.error || "Не удалось проверить баланс");
        return;
      }

      if (checkData.warning) {
        const formatMoney = (value: number) =>
          new Intl.NumberFormat("ru-RU", {
            style: "currency",
            currency: checkData.currency,
          }).format(value);

        const confirmed = window.confirm(
          "Внимание! Расход превышает доступный остаток.\n\n" +
          "Доступно: " + formatMoney(checkData.available) + "\n" +
          "Расход: " + formatMoney(expenseAmount) + "\n" +
          "После расхода: " + formatMoney(checkData.afterExpense) +
          "\n\nНакопления останутся без изменений." +
          "\n\nВсё равно сохранить расход?"
        );

        if (!confirmed) return;
      }

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
        background: "var(--moniq-bg)",
        color: "var(--moniq-text)",
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
          background: "var(--moniq-card)",
          borderRadius: "16px",
        }}
      >
        <button
          type="button"
          onClick={() => router.push("/expenses")}
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
          ← Назад к расходам
        </button>

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
              background: "var(--moniq-input)",
              color: "var(--moniq-text)",
            }}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #333",
              background: "var(--moniq-input)",
              color: "var(--moniq-text)",
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
              background: "var(--moniq-input)",
              color: "var(--moniq-text)",
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
            {loading ? "Сохранение..." : "Сохранить расход"}
          </button>
        </div>
      </div>
    </main>
  );
}