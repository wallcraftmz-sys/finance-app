
"use client";

import BottomNav from "@/components/BottomNav";

import Link from "next/link";
import type { ExchangeRates } from "@/lib/exchange-rates";
import { useEffect, useMemo, useState } from "react";


function formatMoney(amount: number, currency: string = "EUR") {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency,
  }).format(amount);
}

function totalsByCurrency(
  items: { amount: number; currency: string }[]
) {
  const totals: Record<string, number> = {};

  for (const item of items) {
    const currency = item.currency || "EUR";
    totals[currency] = (totals[currency] || 0) + item.amount;
  }

  return totals;
}

function formatTotals(totals: Record<string, number>) {
  return Object.entries(totals)
    .map(([currency, amount]) => formatMoney(amount, currency))
    .join(" · ") || formatMoney(0);
}

type Expense = {
  id: string;
  amount: number;
  currency: string;
  category: string;
  date: string;
  note: string;
};

type Income = {
  id: string;
  amount: number;
  currency: string;
  source: string;
  date: string;
  note: string;
};

type Goal = {
  id: string;
  title: string;
  targetAmount: number;
  savedAmount: number;
  currency: string;
};

type Props = {
  expenses: Expense[];
  incomes: Income[];
  goals: Goal[];
  primaryCurrency: string;
  exchangeRates: ExchangeRates | null;
};

export default function DashboardClient({
  expenses,
  incomes,
  goals,
  primaryCurrency,
  exchangeRates,
}: Props) {
  const [aiAdvice, setAiAdvice] = useState("Анализирую твои финансы...");

  const expenseTotals = useMemo(
    () => totalsByCurrency(expenses),
    [expenses]
  );

  const incomeTotals = useMemo(
    () => totalsByCurrency(incomes),
    [incomes]
  );

  const balanceTotals = useMemo(() => {
    const result: Record<string, number> = {};

    for (const currency of new Set([
      ...Object.keys(incomeTotals),
      ...Object.keys(expenseTotals),
    ])) {
      result[currency] =
        (incomeTotals[currency] || 0) -
        (expenseTotals[currency] || 0);
    }

    return result;
  }, [incomeTotals, expenseTotals]);

  const convertAmount = (amount: number, currency: string) => {
    if (!exchangeRates || !Number.isFinite(amount)) return null;

    const rates = exchangeRates.rates;
    const from = currency as keyof typeof rates;
    const to = primaryCurrency as keyof typeof rates;

    if (!rates[from] || !rates[to]) return null;

    return (amount / rates[from]) * rates[to];
  };

  const convertTotal = (items: { amount: number; currency: string }[]) => {
    let total = 0;

    for (const item of items) {
      const converted = convertAmount(item.amount, item.currency || "EUR");

      if (converted === null || !Number.isFinite(converted)) {
        return null;
      }

      total += converted;
    }

    return total;
  };

  const convertedIncome =
    exchangeRates?.rates[
      primaryCurrency as keyof ExchangeRates["rates"]
    ]
      ? convertTotal(incomes)
      : null;

  const convertedExpense =
    exchangeRates?.rates[
      primaryCurrency as keyof ExchangeRates["rates"]
    ]
      ? convertTotal(expenses)
      : null;

  const convertedBalance =
    convertedIncome !== null && convertedExpense !== null
      ? convertedIncome - convertedExpense
      : null;

  // Деньги, зарезервированные на финансовые цели
  const convertedReserved =
    exchangeRates?.rates[
      primaryCurrency as keyof ExchangeRates["rates"]
    ]
      ? convertTotal(
          goals.map((goal) => ({
            amount: goal.savedAmount ?? 0,
            currency: goal.currency || "EUR",
          }))
        )
      : null;

  // Доступный остаток после резервирования
  const convertedAvailable =
    convertedBalance !== null && convertedReserved !== null
      ? convertedBalance - convertedReserved
      : null;

  const totalIncome = incomeTotals.EUR || 0;
  const totalExpense = expenseTotals.EUR || 0;
  const moneyLeft = balanceTotals.EUR || 0;

  const latestExpenses = [...expenses].slice(0, 4);
  const goal = goals[0] ?? null;

  const categoryTotals = useMemo(() => {
    const map: Record<string, number> = {};

    for (const item of expenses.filter((item) => item.currency === "EUR")) {
      if (!map[item.category]) {
        map[item.category] = 0;
      }
      map[item.category] += item.amount;
    }

    return Object.entries(map)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);
  }, [expenses]);

  useEffect(() => {
    async function loadAdvice() {
      const currencies = new Set([
        ...Object.keys(incomeTotals),
        ...Object.keys(expenseTotals),
      ]);

      if (currencies.size > 1 || (currencies.size === 1 && !currencies.has("EUR"))) {
        setAiAdvice(
          "AI-анализ нескольких валют пока недоступен. " +
          "Доходы и расходы отображаются отдельно без конвертации."
        );
        return;
      }

      try {
        const res = await fetch("/api/ai-advice", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            income: totalIncome,
            expense: totalExpense,
            categories: categoryTotals,
          }),
        });

        const data = await res.json();

        if (res.ok && data.advice) {
          setAiAdvice(data.advice);
          return;
        }

        setAiAdvice("Пока не удалось построить совет. Добавь ещё немного данных.");
      } catch {
        setAiAdvice("Пока не удалось подключить финансовый совет. Попробуй позже.");
      }
    }

    loadAdvice();
  }, [totalIncome, totalExpense, categoryTotals, incomeTotals, expenseTotals]);

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
    });

    window.location.href = "/login";
  }

  const goalSaved = goal?.savedAmount ?? 0;
  const goalTarget = goal?.targetAmount ?? 0;
  const goalCurrency = goal?.currency || "EUR";

  const formatGoalMoney = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: goalCurrency,
    }).format(amount);

  const goalPercent =
    goalTarget > 0
      ? Math.min(Math.round((goalSaved / goalTarget) * 100), 100)
      : 0;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--moniq-bg)",
        color: "var(--moniq-text)",
        display: "flex",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "20px 0 96px",
      }}
    >
      <div
        style={{
          width: "390px",
          padding: "18px",
          borderRadius: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "18px",
          }}
        >
          <div>
            <div style={{ fontSize: "13px", color: "var(--moniq-muted)", marginBottom: "4px" }}>
              Moniq
            </div>
            <h1 style={{ fontSize: "28px", margin: 0, fontWeight: 700 }}>
              Главная
            </h1>
          </div>

          <details style={{ position: "relative" }}>
            <summary
              aria-label="Открыть меню"
              style={{
                listStyle: "none",
                cursor: "pointer",
                width: 44,
                height: 44,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 14,
                border: "1px solid var(--moniq-border)",
                background: "var(--moniq-card)",
                color: "var(--moniq-text)",
                fontSize: 26,
                fontWeight: 700,
              }}
            >
              ⋯
            </summary>

            <div
              style={{
                position: "absolute",
                top: 52,
                right: 0,
                width: 220,
                background: "var(--moniq-card)",
                border: "1px solid var(--moniq-border)",
                borderRadius: 16,
                padding: 10,
                zIndex: 50,
                boxShadow: "0 16px 40px rgba(0,0,0,0.45)",
              }}
            >
              <Link
                href="/settings"
                style={{
                  display: "block",
                  padding: 12,
                  color: "var(--moniq-text)",
                  textDecoration: "none",
                  fontWeight: 600,
                }}
              >
                ⚙ Настройки
              </Link>

              <button
                onClick={handleLogout}
                style={{
                  display: "block",
                  width: "100%",
                  padding: 12,
                  border: "none",
                  borderTop: "1px solid #34343c",
                  background: "transparent",
                  color: "var(--moniq-text)",
                  textAlign: "left",
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                ↪ Выйти из аккаунта
              </button>
            </div>
          </details>
        </div>

        <section
          style={{
            background: "linear-gradient(145deg, #30243f 0%, #211b2d 55%, #19191f 100%)",
            border: "1px solid #59416e",
            borderRadius: "24px",
            padding: "22px",
            marginBottom: "16px",
            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",
          }}
        >
          <div style={{ color: "var(--moniq-muted)", fontSize: "13px", marginBottom: "8px" }}>
            Текущий остаток
          </div>

          <div
            style={{
              fontSize: "40px",
              fontWeight: 800,
              letterSpacing: "-1px",
              marginBottom: "16px",
            }}
          >
            {convertedBalance !== null ? formatMoney(convertedBalance, primaryCurrency) : "Курс валют недоступен"}
          </div>

          <div style={{
            color: "var(--moniq-muted)",
            fontSize: "12px",
            marginBottom: "16px",
          }}>
            {exchangeRates
              ? `Конвертация по курсу ECB от ${exchangeRates.date}`
              : "Не удалось получить курсы ECB"}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                background: "var(--moniq-input)",
                border: "1px solid var(--moniq-border)",
                borderRadius: "16px",
                padding: "12px",
              }}
            >
              <div style={{ color: "var(--moniq-muted)", fontSize: "12px", marginBottom: "6px" }}>
                Зарезервировано
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>
                {convertedReserved !== null
                  ? formatMoney(convertedReserved, primaryCurrency)
                  : "—"}
              </div>
            </div>

            <div
              style={{
                background: "var(--moniq-input)",
                border: "1px solid var(--moniq-border)",
                borderRadius: "16px",
                padding: "12px",
              }}
            >
              <div style={{ color: "var(--moniq-muted)", fontSize: "12px", marginBottom: "6px" }}>
                Доступно
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700, color: "#c4a0ff" }}>
                {convertedAvailable !== null
                  ? formatMoney(convertedAvailable, primaryCurrency)
                  : "—"}
              </div>
            </div>
          </div>

          <div className="moniq-mobile-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
            <div
              style={{
                background: "var(--moniq-input)",
                border: "1px solid var(--moniq-border)",
                borderRadius: "18px",
                padding: "12px",
              }}
            >
              <div style={{ color: "var(--moniq-muted)", fontSize: "12px", marginBottom: "6px" }}>
                Доход
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px" }}>{convertedIncome !== null ? formatMoney(convertedIncome, primaryCurrency) : "—"}</div>
            </div>

            <div
              style={{
                background: "var(--moniq-input)",
                border: "1px solid var(--moniq-border)",
                borderRadius: "18px",
                padding: "12px",
              }}
            >
              <div style={{ color: "var(--moniq-muted)", fontSize: "12px", marginBottom: "6px" }}>
                Расход
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px" }}>{convertedExpense !== null ? formatMoney(convertedExpense, primaryCurrency) : "—"}</div>
            </div>

            <div
              style={{
                background: "var(--moniq-input)",
                border: "1px solid var(--moniq-border)",
                borderRadius: "18px",
                padding: "12px",
              }}
            >
              <div style={{ color: "var(--moniq-muted)", fontSize: "12px", marginBottom: "6px" }}>
                Баланс
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px", color: "#fbbf24" }}>
                {convertedBalance !== null ? formatMoney(convertedBalance, primaryCurrency) : "Курс валют недоступен"}
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <Link href="/income" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "var(--moniq-card)",
                border: "1px solid var(--moniq-border)",
                borderRadius: "20px",
                padding: "16px",
                color: "var(--moniq-text)",
              }}
            >
              <div style={{ fontSize: "13px", color: "var(--moniq-muted)", marginBottom: "6px" }}>
                Быстрое действие
              </div>
              <div style={{ fontSize: "18px", fontWeight: 700 }}>Доходы</div>
            </div>
          </Link>

          <Link href="/expenses/new" style={{ textDecoration: "none" }}>
            <div
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                borderRadius: "20px",
                padding: "16px",
                color: "#111",
              }}
            >
              <div style={{ fontSize: "13px", opacity: 0.8, marginBottom: "6px" }}>
                Быстрое действие
              </div>
              <div style={{ fontSize: "18px", fontWeight: 800 }}>+ Расход</div>
            </div>
          </Link>
        </section>

        <section
          style={{
            background: "var(--moniq-card)",
            border: "1px solid var(--moniq-border)",
            borderRadius: "22px",
            padding: "18px",
            marginBottom: "16px",
          }}
        >
          {!goal ? (
            <>
              <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "10px" }}>
                Финансовая цель
              </div>
              <div style={{ color: "var(--moniq-muted)", fontSize: "14px", marginBottom: "12px" }}>
                У тебя пока нет цели. Создай её, чтобы видеть прогресс прямо на главной.
              </div>

              <Link href="/goals/new" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    width: "100%",
                    padding: "12px",
                    background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                    border: "none",
                    borderRadius: "14px",
                    fontWeight: 800,
                    color: "#111",
                    cursor: "pointer",
                  }}
                >
                  + Создать цель
                </button>
              </Link>
            </>
          ) : (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                <div style={{ fontSize: "16px", fontWeight: 700 }}>{goal.title}</div>
                <div style={{ fontSize: "13px", color: "var(--moniq-muted)" }}>
                  {`${formatGoalMoney(goalSaved)} / ${formatGoalMoney(goalTarget)}`}
                </div>
              </div>

              <div
                style={{
                  height: "10px",
                  background: "#26262b",
                  borderRadius: "999px",
                  overflow: "hidden",
                  marginBottom: "8px",
                }}
              >
                <div
                  style={{
                    width: `${goalPercent}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
                  }}
                />
              </div>

              <div style={{ color: "var(--moniq-muted)", fontSize: "12px" }}>
                Прогресс: {goalPercent}%
              </div>
            </>
          )}
        </section>

        <section
          style={{
            background: "var(--moniq-card)",
            border: "1px solid var(--moniq-border)",
            borderRadius: "22px",
            padding: "18px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "12px" }}>
            Последние расходы
          </div>

          {latestExpenses.length === 0 ? (
            <div style={{ color: "var(--moniq-muted)", fontSize: "14px" }}>Пока расходов нет</div>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {latestExpenses.map((item) => (
                <div
                  key={item.id}
                  style={{
                    background: "var(--moniq-input)",
                    border: "1px solid var(--moniq-border)",
                    borderRadius: "18px",
                    padding: "14px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <div style={{ fontWeight: 700 }}>{item.category}</div>
                    <div style={{ fontWeight: 700, color: "#fbbf24" }}>
                      {formatMoney(item.amount, item.currency)}
                    </div>
                  </div>

                  <div style={{ color: "var(--moniq-muted)", fontSize: "12px", marginBottom: "6px" }}>
                    {item.date}
                  </div>

                  {item.note ? (
                    <div style={{ color: "#c8c8ce", fontSize: "13px", marginBottom: "10px" }}>
                      {item.note}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <BottomNav />
      </div>
    </main>
  );
}