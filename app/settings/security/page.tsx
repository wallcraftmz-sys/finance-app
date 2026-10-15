import SessionsManager from "./SessionsManager";
import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function SecurityPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("finance_session")?.value;

  const session = token
    ? await prisma.session.findFirst({
        where: {
          token,
          userId: user.id,
          expiresAt: { gt: new Date() },
        },
        select: {
          createdAt: true,
          expiresAt: true,
        },
      })
    : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "var(--moniq-bg)",
        color: "var(--moniq-text)",
        padding: "32px 18px 100px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 28,
          }}
        >
          <Link
            href="/settings"
            style={{
              color: "var(--moniq-text)",
              textDecoration: "none",
              fontSize: 24,
            }}
          >
            ←
          </Link>

          <h1 style={{ fontSize: 24, margin: 0 }}>
            Безопасность
          </h1>

          <span style={{ color: "var(--moniq-accent)", fontWeight: 700 }}>
            Moniq
          </span>
        </header>

        <section
          style={{
            background: "var(--moniq-card)",
            border: "1px solid var(--moniq-border)",
            borderRadius: 22,
            padding: 24,
            marginBottom: 18,
          }}
        >
          <h2 style={{ fontSize: 19, marginTop: 0 }}>
            🔐 Пароль
          </h2>

          <ChangePasswordForm />
        </section>

        <SessionsManager />
      </div>
    </main>
  );
}
