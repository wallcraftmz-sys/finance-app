import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import DeleteAccountForm from "../profile/DeleteAccountForm";

export default async function DeleteAccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0f",
        color: "#ffffff",
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
              color: "#ffffff",
              fontSize: 24,
              textDecoration: "none",
            }}
          >
            ←
          </Link>

          <h1 style={{ fontSize: 22, margin: 0 }}>
            Удаление аккаунта
          </h1>

          <span style={{ color: "#ffb51b", fontWeight: 700 }}>
            Moniq
          </span>
        </header>

        <DeleteAccountForm />
      </div>
    </main>
  );
}
