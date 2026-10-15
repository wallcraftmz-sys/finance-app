"use client";

import BottomNav from "@/components/BottomNav";

import Link from "next/link";
import { useEffect, useState } from "react";

type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  currency: string;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [goalAction, setGoalAction] = useState<"deposit" | "withdraw">("deposit");
  const [depositAmount, setDepositAmount] = useState("");
  const [depositLoading, setDepositLoading] = useState(false);
  const [depositError, setDepositError] = useState("");

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
    const goal = goals.find((item) => item.id === id);

    if (!goal) return;

    const currency = goal.currency || "EUR";
    const saved = new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency,
    }).format(goal.savedAmount ?? 0);

    const confirmed = window.confirm(
      `Удалить цель «${goal.title}»?\n\n` +
      `Зарезервированные ${saved} снова станут доступными.\n` +
      `Общий баланс не изменится.\n\n` +
      `Это действие нельзя отменить.`
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/goals/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setGoals((prev) => prev.filter((item) => item.id !== id));
      } else {
        const data = await res.json();
        alert(data.error || "Не удалось удалить цель");
      }
    } catch {
      alert("Ошибка соединения. Попробуйте ещё раз.");
    }
  }

  async function handleDeposit(id: string) {
    const normalized = depositAmount.trim().replace(",", ".");
    const amount = Number(normalized);

    if (
      !normalized ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      ! /^\d+(\.\d{1,2})?$/.test(normalized)
    ) {
      setDepositError("Введите положительную сумму с точностью до двух знаков.");
      return;
    }

    setDepositLoading(true);
    setDepositError("");

    try {
      const res = await fetch(`/api/goals/${id}/${goalAction}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setDepositError(data.error || "Не удалось выполнить операцию");
        return;
      }

      setGoals((prev) =>
        prev.map((goal) => goal.id === id ? data.goal : goal)
      );
      setDepositGoalId(null);
      setDepositAmount("");
    } catch {
      setDepositError("Не удалось подключиться к серверу.");
    } finally {
      setDepositLoading(false);
    }
  }

  useEffect(() => {
    loadGoals();
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--moniq-bg)",
        color: "var(--moniq-text)",
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
       <h1 style={{ fontSize: "28px", marginBottom: "12px" }}>Цели</h1>


        {loading ? (
          <div>Загрузка...</div>
        ) : goals.length === 0 ? (
          <div
            style={{
              background: "var(--moniq-card)",
              padding: "18px",
              borderRadius: "22px",
              border: "1px solid #26262b",
            }}
          >
            <p style={{ color: "var(--moniq-muted)", marginTop: 0 }}>
              У тебя пока нет цели. Создай свою первую финансовую цель.
            </p>

            <Link href="/goals/new" style={{ textDecoration: "none" }}>
              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  background: "var(--moniq-accent)",
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
                  background: "var(--moniq-card)",
                  padding: "18px",
                  borderRadius: "22px",
                  border: "1px solid #26262b",
                }}
              >
                <div style={{ fontSize: "14px", color: "var(--moniq-muted)", marginBottom: "8px" }}>
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
                  <b>
                    {new Intl.NumberFormat("ru-RU", {
                      style: "currency",
                      currency: goal.currency || "EUR",
                    }).format(goal.targetAmount)}
                  </b>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    gap: "8px",
                  }}>
                    <span>Накоплено</span>
                    <b>
                      {new Intl.NumberFormat("ru-RU", {
                        style: "currency",
                        currency: goal.currency || "EUR",
                      }).format(goal.savedAmount ?? 0)}
                    </b>
                  </div>

                  <div style={{
                    background: "var(--moniq-border)",
                    height: "10px",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}>
                    <div style={{
                      width: `${goal.targetAmount > 0
                        ? Math.min(((goal.savedAmount ?? 0) / goal.targetAmount) * 100, 100)
                        : 0}%`,
                      height: "100%",
                      background: "var(--moniq-accent)",
                      borderRadius: "10px",
                    }} />
                  </div>

                  <div style={{
                    color: "var(--moniq-muted)",
                    fontSize: "13px",
                    marginTop: "7px",
                  }}>
                    {goal.targetAmount > 0
                      ? Math.min(Math.round(((goal.savedAmount ?? 0) / goal.targetAmount) * 100), 100)
                      : 0}% выполнено
                  </div>
                </div>

                {depositGoalId === goal.id ? (
                  <div style={{ marginBottom: "14px" }}>
                    <input
                      type="text"
                      inputMode="decimal"
                      placeholder={`Сумма в ${goal.currency || "EUR"}`}
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      style={{
                        width: "100%",
                        boxSizing: "border-box",
                        padding: "13px",
                        borderRadius: "12px",
                        border: "1px solid #444",
                        background: "var(--moniq-input)",
                        color: "var(--moniq-text)",
                        marginBottom: "8px",
                      }}
                    />

                    {depositError && (
                      <p style={{ color: "#f87171" }}>{depositError}</p>
                    )}

                    <button
                      disabled={depositLoading}
                      onClick={() => handleDeposit(goal.id)}
                      style={{
                        width: "100%",
                        padding: "13px",
                        borderRadius: "12px",
                        border: "none",
                        background: "var(--moniq-accent)",
                        fontWeight: 800,
                        cursor: "pointer",
                      }}
                    >
                      {depositLoading ? "Сохраняем..." : goalAction === "deposit" ? "Сохранить пополнение" : "Подтвердить снятие"}
                    </button>

                    <button
                      disabled={depositLoading}
                      onClick={() => {
                        setDepositGoalId(null);
                        setDepositError("");
                        setDepositAmount("");
                      }}
                      style={{
                        width: "100%",
                        padding: "10px",
                        marginTop: "7px",
                        background: "transparent",
                        color: "var(--moniq-muted)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Отмена
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setDepositGoalId(goal.id);
                      setGoalAction("deposit");
                      setDepositAmount("");
                      setDepositError("");
                    }}
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginBottom: "12px",
                      borderRadius: "16px",
                      border: "none",
                      background: "var(--moniq-accent)",
                      color: "#111",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    + Пополнить цель
                  </button>
                )}

                
                {depositGoalId !== goal.id && (goal.savedAmount ?? 0) > 0 && (
                  <button
                    onClick={() => {
                      setDepositGoalId(goal.id);
                      setGoalAction("withdraw");
                      setDepositAmount("");
                      setDepositError("");
                    }}
                    style={{
                      width: "100%",
                      padding: "14px",
                      marginBottom: "12px",
                      borderRadius: "16px",
                      border: "1px solid #444",
                      background: "var(--moniq-input)",
                      color: "var(--moniq-text)",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    − Снять с цели
                  </button>
                )}

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
                      color: "#ffffff",
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
                  background: "var(--moniq-accent)",
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
          <BottomNav />
    </main>
  );
}