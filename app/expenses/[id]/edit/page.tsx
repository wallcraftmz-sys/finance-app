import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ExpenseForm from "../../ExpenseForm";

export default async function EditExpensePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const expense = await prisma.expense.findFirst({
    where: { id, userId: user.id },
    select: { id: true, amount: true, currency: true, category: true, date: true, note: true },
  });
  if (!expense) notFound();

  return <ExpenseForm expense={expense} />;
}
