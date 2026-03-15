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

type Goal = {
  title: string;
  targetAmount: number;
};

const EXPENSES_KEY = "finance-expenses";
const INCOME_KEY = "finance-income";
const GOAL_KEY = "finance-goal";

export default function DashboardClient() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [goal, setGoal] = useState<Goal | null>(null);

  useEffect(() => {
    const rawExpenses = localStorage.getItem(EXPENSES_KEY);
    const rawIncome = localStorage.getItem(INCOME_KEY);
    const rawGoal = localStorage.getItem(GOAL_KEY);

    const expenseData: Expense[] = rawExpenses ? JSON.parse(rawExpenses) : [];
    const incomeData: Income[] = rawIncome ? JSON.parse(rawIncome) : [];
    const goalData: Goal | null = rawGoal ? JSON.parse(rawGoal) : null;

    setExpenses(expenseData);
    setIncome(incomeData);
    setGoal(goalData);
  }, []);

  const totalExpense = useMemo(() => {
    return expenses.reduce((sum, item) => sum + item.amount, 0);
  }, [expenses]);

  const totalIncome = useMemo(() => {
    return income.reduce((sum, item) => sum + item.amount, 0);
  }, [income]);

  const moneyLeft = totalIncome - totalExpense;

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("finance-user");
    window.location.href = "/login";
  }

  return (
    <main style={{ padding: "40px", color: "white" }}>
      <h1>Dashboard</h1>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={logout}>Выйти</button>
      </div>

      <div>Доход: {totalIncome}€</div>
      <div>Расход: {totalExpense}€</div>
      <div>Баланс: {moneyLeft}€</div>

      <div style={{ marginTop: "20px" }}>
        <Link href="/income">Доход</Link>
        <br />
        <Link href="/expenses">Расходы</Link>
        <br />
        <Link href="/analytics">Аналитика</Link>
      </div>
    </main>
  );
}