"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Expense = {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string;
};

type Income = {
  id: string;
  amount: number;
  source: string;
  date: string;
  note: string;
};

const EXPENSES_KEY = "finance-expenses";
const INCOME_KEY = "finance-income";

export default function Dashboard() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);

  useEffect(() => {
    const rawExpenses = localStorage.getItem(EXPENSES_KEY);
    const rawIncome = localStorage.getItem(INCOME_KEY);

    const expenseData: Expense[] = rawExpenses ? JSON.parse(rawExpenses) : [];
    const incomeData: Income[] = rawIncome ? JSON.parse(rawIncome) : [];

    setExpenses(expenseData);
    setIncome(incomeData);
  }, []);

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return income.reduce((sum, item) => sum + item.amount, 0);
  }, [income]);

  const moneyLeft = totalIncome - totalExpense;
  const latestExpenses = [...expenses].reverse().slice(0, 5);

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};

    for (const item of expenses) {
      if (!map[item.category]) {
        map[item.category] = 0;
      }
      map[item.category] += item.amount;
    }

    return Object.entries(map)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  const aiTip = useMemo(() => {
    if (totalIncome === 0 && totalExpense === 0) {
      return "Добавь первый доход и первый расход — тогда я смогу дать финансовую подсказку.";
    }

    if (totalIncome > 0 && totalExpense === 0) {
      return "У тебя пока нет расходов. Добавь траты, чтобы увидеть аналитику и понять, куда уходят деньги.";
    }

    if (moneyLeft < 0) {
      return "Ты ушёл в минус. Расходы сейчас выше доходов — начни с самой крупной категории и попробуй сократить её хотя бы на 10–15%.";
    }

    if (categoryTotals.length > 0) {
      const topCategory = categoryTotals[0];

      if (moneyLeft <= totalIncome * 0.2) {
        return `Больше всего ты тратишь на категорию "${topCategory.category}" — ${topCategory.amount}€. Остаток уже низкий, поэтому начни контроль именно с этой категории.`;
      }

      return `Самая крупная категория расходов — "${topCategory.category}" (${topCategory.amount}€). У тебя ещё остаётся ${moneyLeft}€, часть этой суммы можно направить в накопления.`;
    }

    return "Финансовая картина уже собирается. Продолжай вносить доходы и расходы, чтобы получать точные советы.";
  }, [totalIncome, totalExpense, moneyLeft, categoryTotals]);

  function handleDelete(id: string) {
    const updated = expenses.filter((item) => item.id !== id);
    setExpenses(updated);
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(updated));
  }

  const goalName = "Резервный фонд";
  const goalTarget = 2000;
  const goalSaved = Math.max(moneyLeft, 0);
  const goalPercent =
    goalTarget > 0 ? Math.min(Math.round((goalSaved / goalTarget) * 100), 100) : 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        fontFamily: "sans-serif",
        padding: "20px 0 90px",
      }}
    >
      <div
        style={{
          width: "380px",
          padding: "30px",
          background: "#111",
          borderRadius: "16px",
          position: "relative",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "20px" }}>FinTrack</h1>

        <h2 style={{ marginBottom: "10px" }}>Март 2026</h2>

        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <div
            style={{
              background: "#1a1a1a",
              padding: "10px",
              borderRadius: "10px",
              flex: 1,
            }}
          >
            <div>Доход</div>
            <b>{totalIncome}€</b>
          </div>

          <div
            style={{
              background: "#1a1a1a",
              padding: "10px",
              borderRadius: "10px",
              flex: 1,
            }}
          >
            <div>Расход</div>
            <b>{totalExpense}€</b>
          </div>

          <div
            style={{
              background: "#1a1a1a",
              padding: "10px",
              borderRadius: "10px",
              flex: 1,
            }}
          >
            <div>Осталось</div>
            <b style={{ color: "#f59e0b" }}>{moneyLeft}€</b>
          </div>
        </div>

        <div style={{ display: "grid", gap: "10px", marginBottom: "20px" }}>
          <Link href="/income/new" style={{ textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                padding: "12px",
                background: "#2a2a2a",
                color: "white",
                border: "1px solid #3a3a3a",
                borderRadius: "10px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Добавить доход
            </button>
          </Link>

          <Link href="/expenses/new" style={{ textDecoration: "none" }}>
            <button
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
              Добавить расход
            </button>
          </Link>
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>AI-подсказка</h3>

          <p
            style={{
              margin: 0,
              color: "#d4d4d4",
              lineHeight: 1.6,
              fontSize: "14px",
            }}
          >
            {aiTip}
          </p>
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>Финансовая цель</h3>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
              gap: "10px",
            }}
          >
            <b>{goalName}</b>
            <b>
              {goalSaved}€ / {goalTarget}€
            </b>
          </div>

          <div
            style={{
              height: "10px",
              background: "#2a2a2a",
              borderRadius: "999px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${goalPercent}%`,
                height: "100%",
                background: "#f59e0b",
              }}
            />
          </div>

          <div
            style={{
              marginTop: "8px",
              fontSize: "12px",
              color: "#aaa",
            }}
          >
            Прогресс: {goalPercent}%
          </div>
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
            marginBottom: "20px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>
            Аналитика по категориям
          </h3>

          {categoryTotals.length === 0 ? (
            <p style={{ color: "#999", margin: 0 }}>Пока аналитики нет</p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {categoryTotals.map((item) => {
                const percent =
                  totalExpense > 0
                    ? Math.round((item.amount / totalExpense) * 100)
                    : 0;

                return (
                  <div
                    key={item.category}
                    style={{
                      padding: "12px",
                      background: "#111",
                      borderRadius: "10px",
                      border: "1px solid #2a2a2a",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <b>{item.category}</b>
                      <b>{item.amount}€</b>
                    </div>

                    <div
                      style={{
                        height: "8px",
                        background: "#2a2a2a",
                        borderRadius: "999px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: `${percent}%`,
                          height: "100%",
                          background: "#f59e0b",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "12px",
                        color: "#aaa",
                      }}
                    >
                      {percent}% от всех расходов
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "16px",
            borderRadius: "12px",
          }}
        >
          <h3 style={{ marginTop: 0, marginBottom: "14px" }}>Последние расходы</h3>

          {latestExpenses.length === 0 ? (
            <p style={{ color: "#999", margin: 0 }}>Пока расходов нет</p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {latestExpenses.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: "12px",
                    background: "#111",
                    borderRadius: "10px",
                    border: "1px solid #2a2a2a",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "6px",
                      gap: "10px",
                    }}
                  >
                    <b>{item.category}</b>
                    <b style={{ color: "#f59e0b" }}>{item.amount}€</b>
                  </div>

                  <div style={{ fontSize: "13px", color: "#aaa" }}>{item.date}</div>

                  {item.note ? (
                    <div
                      style={{
                        fontSize: "13px",
                        color: "#ccc",
                        marginTop: "6px",
                      }}
                    >
                      {item.note}
                    </div>
                  ) : null}

                  <button
                    onClick={() => handleDelete(item.id)}
                    style={{
                      marginTop: "10px",
                      padding: "8px 10px",
                      background: "#2a2a2a",
                      color: "white",
                      border: "1px solid #3a3a3a",
                      borderRadius: "8px",
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

        <div
          style={{
            position: "fixed",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "380px",
            background: "#161616",
            border: "1px solid #2a2a2a",
            borderRadius: "16px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            overflow: "hidden",
          }}
        >
          <Link
            href="/"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "#f59e0b",
              textDecoration: "none",
              fontWeight: "bold",
              background: "#1d1d1d",
            }}
          >
            Главная
          </Link>

          <Link
  href="/analytics"
  style={{
    padding: "14px 10px",
    textAlign: "center",
    color: "white",
    textDecoration: "none",
  }}
>
  Аналитика
</Link>

<Link
  href="/goals"
  style={{
    padding: "14px 10px",
    textAlign: "center",
    color: "white",
    textDecoration: "none",
  }}
>
  Цель
</Link>

          <Link
            href="/income"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            Доход
          </Link>

          <Link
            href="/expenses/new"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            Расход
          </Link>
        </div>
      </div>
    </main>
  );
}