"use client";

import TransactionDateField from "@/components/TransactionDateField";
import { dateForInput } from "@/lib/transaction-date";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Expense = {
  id: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  note: string;
};

const categories = ["Еда", "Транспорт", "Жилье", "Подписки", "Развлечения", "Другое"];

export default function ExpenseForm({ expense }: { expense?: Expense }) {
  const router = useRouter();

  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [category, setCategory] = useState(expense?.category ?? categories[0]);
  const [date, setDate] = useState(expense ? dateForInput(expense.date) : "");
  const [note, setNote] = useState(expense?.note ?? "");
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
        body: JSON.stringify({ amount: expenseAmount, expenseId: expense?.id }),
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
          "Расход: " + formatMoney(checkData.amount) + "\n" +
          "После расхода: " + formatMoney(checkData.afterExpense) +
          "\n\nНакопления останутся без изменений." +
          "\n\nВсё равно сохранить расход?"
        );

        if (!confirmed) return;
      }

      const res = await fetch(expense ? `/api/expenses/${expense.id}` : "/api/expenses", {
        method: expense ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: expenseAmount,
          category,
          date,
          note,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Не удалось сохранить расход");
        return;
      }

      router.push("/expenses");
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
          {expense ? "Изменить расход" : "Добавить расход"}
        </h1>

        <div style={{ display: "grid", gap: "12px" }}>
          <input
            type="number"
            placeholder="Сумма"
            aria-label={expense ? `Сумма (${expense.currency || "EUR"})` : "Сумма"}
            step="0.01"
            min="0.01"
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
            aria-label="Категория"
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
            {expense && !categories.includes(expense.category) && (
              <option>{expense.category}</option>
            )}
            {categories.map((option) => <option key={option}>{option}</option>)}
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
            {loading ? "Сохранение..." : "Сохранить расход"}
          </button>
        </div>
      </div>
    </main>
  );
}