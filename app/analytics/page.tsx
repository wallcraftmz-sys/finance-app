import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AnalyticsClient from "./analytics-client";

export default async function AnalyticsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("finance_session")?.value;

  if (!token) {
    redirect("/login");
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: true,
    },
  });

  if (!session) {
    redirect("/login");
  }

  if (session.expiresAt < new Date()) {
    redirect("/login");
  }

  const [expenses, incomes] = await Promise.all([
    prisma.expense.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.income.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return <AnalyticsClient expenses={expenses} incomes={incomes} />;
}