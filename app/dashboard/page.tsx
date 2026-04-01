import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
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
    await prisma.session.deleteMany({
      where: { token },
    });

    redirect("/login");
  }

  const [goals, incomes, expenses] = await Promise.all([
    prisma.goal.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.income.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.expense.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <DashboardClient
      goals={goals}
      incomes={incomes}
      expenses={expenses}
    />
  );
}