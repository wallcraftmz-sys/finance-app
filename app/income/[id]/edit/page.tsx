import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import IncomeForm from "../../IncomeForm";

export default async function EditIncomePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const income = await prisma.income.findFirst({
    where: { id, userId: user.id },
    select: { id: true, amount: true, currency: true, source: true, date: true, note: true },
  });
  if (!income) notFound();

  return <IncomeForm income={income} />;
}
