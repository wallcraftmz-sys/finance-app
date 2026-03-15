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
});

if (!session) {
redirect("/login");
}

if (session.expiresAt < new Date()) {
redirect("/login");
}

return <DashboardClient />;
}
