import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import WelcomeClient from "./WelcomeClient";

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("finance_session")?.value;

  console.log("HOME TOKEN EXISTS:", !!token);

  if (token) {
    const session = await prisma.session.findUnique({
      where: { token },
    });

    console.log("HOME SESSION EXISTS:", !!session);

    if (session && session.expiresAt >= new Date()) {
      console.log("HOME REDIRECTING TO DASHBOARD");
      redirect("/dashboard");
    }

    if (session && session.expiresAt < new Date()) {
      await prisma.session.deleteMany({
        where: { token },
      });
    }
  }

  return <WelcomeClient />;
}