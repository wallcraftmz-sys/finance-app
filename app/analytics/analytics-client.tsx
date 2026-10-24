
"use client";

import BottomNav from "@/components/BottomNav";

import Link from "next/link";
import type { ExchangeRates } from "@/lib/exchange-rates";
import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

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

type Props = {
  expenses: Expense[];
  incomes: Income[];
  primaryCurrency: string;
  exchangeRates: ExchangeRates | null;
  plan: string;
};

const COLORS = ["var(--moniq-accent)", "#f59e0b", "#fcd34d", "#facc15", "#fde68a", "#ca8a04"];

export default function AnalyticsClient({
  expenses,
  incomes,
  primaryCurrency,
  exchangeRates,
  plan,
}: Props) {
  const isPro = plan === "PRO";
  const analytics = useMemo(() => {
    const rates = exchangeRates?.rates;
    const to = primaryCurrency as keyof NonNullable<typeof rates>;

    if (!rates || !rates[to]) return null;

    const convert = (amount: number, currency: string) => {
      const from = (currency || "EUR") as keyof typeof rates;

      if (!Number.isFinite(amount) || !rates[from]) return null;

      const result = (amount / rates[from]) * rates[to];
      return Number.isFinite(result) ? result : null;
    };

    let totalIncome = 0;
    let totalExpense = 0;
    const categories: Record<string, number> = {};

    for (const item of incomes) {
      const amount = convert(item.amount, item.currency);
      if (amount === null) return null;
      totalIncome += amount;
    }

    for (const item of expenses) {
      const amount = convert(item.amount, item.currency);
      if (amount === null) return null;

      totalExpense += amount;
      categories[item.category] =
        (categories[item.category] || 0) + amount;
    }

    const categoryTotals = Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount);

    return {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      categoryTotals,
    };
  }, [expenses, incomes, exchangeRates, primaryCurrency]);

    const monthlyAnalytics = useMemo(() => {
    if (!isPro) return [];

    const rates = exchangeRates?.rates;
    const to = primaryCurrency as keyof NonNullable<typeof rates>;

    if (!rates || !rates[to]) return [];

    const months: Record<
      string,
      { month: string; income: number; expense: number }
    > = {};

    const getMonth = (date: string) => {
      const value = date.trim();
      let year: number;
      let month: number;
      let day: number;

      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        [year, month, day] = value.split("-").map(Number);
      } else if (/^\d{2}\.\d{2}\.\d{4}$/.test(value)) {
        [day, month, year] = value.split(".").map(Number);
      } else if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
        [year, month, day] = value.slice(0, 10).split("-").map(Number);
      } else {
        return null;
      }

      const parsed = new Date(Date.UTC(year, month - 1, day));

      if (
        parsed.getUTCFullYear() !== year ||
        parsed.getUTCMonth() !== month - 1 ||
        parsed.getUTCDate() !== day
      ) {
        return null;
      }

      return `${year}-${String(month).padStart(2, "0")}`;
    };

    const convert = (amount: number, currency: string) => {
      const from = (currency || "EUR") as keyof typeof rates;

      if (!Number.isFinite(amount) || !rates[from]) return null;

      const result = (amount / rates[from]) * rates[to];

      return Number.isFinite(result) ? result : null;
    };

    for (const item of incomes) {
      const month = getMonth(item.date);
      const amount = convert(item.amount, item.currency);

      if (!month || amount === null) continue;

      if (!months[month]) {
        months[month] = { month, income: 0, expense: 0 };
      }

      months[month].income += amount;
    }

    for (const item of expenses) {
      const month = getMonth(item.date);
      const amount = convert(item.amount, item.currency);

      if (!month || amount === null) continue;

      if (!months[month]) {
        months[month] = { month, income: 0, expense: 0 };
      }

      months[month].expense += amount;
    }

    return Object.values(months).sort((a, b) =>
      a.month.localeCompare(b.month)
    );
  }, [isPro, incomes, expenses, exchangeRates, primaryCurrency]);
  const totalIncome = analytics?.totalIncome ?? null;
  const totalExpense = analytics?.totalExpense ?? null;
  const balance = analytics?.balance ?? null;
  const categoryTotals = analytics?.categoryTotals ?? [];

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: primaryCurrency,
    }).format(amount);

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
          width: "100%", maxWidth: "430px", boxSizing: "border-box",
          padding: "18px",
          borderRadius: "24px",
        }}
      >
        <h1 style={{ fontSize: "28px", marginBottom: "8px" }}>Аналитика</h1>
        <div style={{
          color: "var(--moniq-muted)",
          fontSize: "12px",
          marginBottom: "18px",
        }}>
          {exchangeRates
            ? `Конвертация по курсу ECB от ${exchangeRates.date}`
            : "Курсы ECB недоступны"}
        </div>

        <section
          style={{
            background: "var(--moniq-card)",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "18px",
            marginBottom: "16px",
          }}
        >
          <div className="moniq-mobile-stats" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "10px" }}>
            <div
              style={{
                background: "var(--moniq-input)",
                border: "1px solid #24242a",
                borderRadius: "16px",
                padding: "12px",
              }}
            >
              <div style={{ color: "var(--moniq-muted)", fontSize: "12px", marginBottom: "6px" }}>
                Доход
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px" }}>{totalIncome !== null ? formatMoney(totalIncome) : "—"}</div>
            </div>

            <div
              style={{
                background: "var(--moniq-input)",
                border: "1px solid #24242a",
                borderRadius: "16px",
                padding: "12px",
              }}
            >
              <div style={{ color: "var(--moniq-muted)", fontSize: "12px", marginBottom: "6px" }}>
                Расход
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px" }}>{totalExpense !== null ? formatMoney(totalExpense) : "—"}</div>
            </div>

            <div
              style={{
                background: "var(--moniq-input)",
                border: "1px solid #24242a",
                borderRadius: "16px",
                padding: "12px",
              }}
            >
              <div style={{ color: "var(--moniq-muted)", fontSize: "12px", marginBottom: "6px" }}>
                Баланс
              </div>
              <div style={{ fontWeight: 700, fontSize: "18px", color: "var(--moniq-accent)" }}>
                {balance !== null ? formatMoney(balance) : "—"}
              </div>
            </div>
          </div>
        </section>

        <section
          style={{
            background: "var(--moniq-card)",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "18px",
            marginBottom: "16px",
          }}
        >
          <div style={{ fontSize: "18px", fontWeight: 700, marginBottom: "14px" }}>
            Расходы по категориям
          </div>

          {analytics === null ? (
            <div style={{ color: "var(--moniq-accent)", fontSize: '14px' }}>
              Не удалось рассчитать аналитику: курсы валют недоступны.
            </div>
          ) : categoryTotals.length === 0 ? (
            <div style={{ color: "var(--moniq-muted)", fontSize: "14px" }}>
              Пока нет расходов для аналитики
            </div>
          ) : (
            <>
              <div style={{ width: "100%", height: "260px", marginBottom: "14px" }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={categoryTotals}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                    >
                      {categoryTotals.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatMoney(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div style={{ display: "grid", gap: "10px" }}>
                {categoryTotals.map((item, index) => (
                  <div
                    key={item.category}
                    style={{
                      background: "var(--moniq-input)",
                      border: "1px solid #24242a",
                      borderRadius: "16px",
                      padding: "12px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div
                        style={{
                          width: "12px",
                          height: "12px",
                          borderRadius: "999px",
                          background: COLORS[index % COLORS.length],
                        }}
                      />
                      <div style={{ fontWeight: 600 }}>{item.category}</div>
                    </div>

                    <div style={{ color: "var(--moniq-accent)", fontWeight: 700 }}>{formatMoney(item.amount)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>
                  {isPro && (
          <section
            style={{
              background: "var(--moniq-card)",
              border: "1px solid #26262b",
              borderRadius: "22px",
              padding: "18px",
              marginBottom: "16px",
            }}
          >
            <div
              style={{
                fontSize: "18px",
                fontWeight: 700,
                marginBottom: "6px",
              }}
            >
              Доходы и расходы по месяцам
            </div>

            <div
              style={{
                color: "var(--moniq-muted)",
                fontSize: "12px",
                marginBottom: "18px",
              }}
            >
              Расширенная аналитика Moniq PRO
            </div>

            {monthlyAnalytics.length === 0 ? (
              <div
                style={{
                  color: "var(--moniq-muted)",
                  fontSize: "14px",
                }}
              >
                Пока нет операций с корректными датами для графика.
              </div>
            ) : (
              <div style={{ width: "100%", height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyAnalytics}
                    margin={{ top: 10, right: 5, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />

                    <XAxis
                      dataKey="month"
                      tick={{ fill: "var(--moniq-muted)", fontSize: 11 }}
                    />

                    <YAxis
                      tick={{ fill: "var(--moniq-muted)", fontSize: 11 }}
                      width={55}
                    />

                    <Tooltip
                      formatter={(value) => formatMoney(Number(value))}
                    />

                    <Legend />

                    <Bar
                      dataKey="income"
                      name="Доходы"
                      fill="var(--moniq-accent)"
                      radius={[5, 5, 0, 0]}
                    />

                    <Bar
                      dataKey="expense"
                      name="Расходы"
                      fill="#f59e0b"
                      radius={[5, 5, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </section>
        )}
        <BottomNav />
      </div>
    </main>
  );
}