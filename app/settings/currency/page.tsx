import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import CurrencySelector from "./CurrencySelector";

export default async function CurrencyPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

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
              fontSize: 24,
              textDecoration: "none",
            }}
          >
            ←
          </Link>

          <h1 style={{ fontSize: 22, margin: 0 }}>
            Основная валюта
          </h1>

          <span style={{ color: "var(--moniq-accent)", fontWeight: 700 }}>
            Moniq
          </span>
        </header>

        <p
          style={{
            color: "var(--moniq-muted)",
            fontSize: 14,
            lineHeight: 1.6,
            marginBottom: 24,
          }}
        >
          Выберите основную валюту вашего аккаунта.
        </p>

        <CurrencySelector initialCurrency={user.currency} />
      </div>
    </main>
  );
}
