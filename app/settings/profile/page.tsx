import AvatarUpload from "./AvatarUpload";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import ProfileNameForm from "./ProfileNameForm";

export default async function ProfilePage() {
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

          <h1 style={{ fontSize: 24, margin: 0 }}>Мой профиль</h1>

          <span style={{ color: "var(--moniq-accent)", fontWeight: 700 }}>
            Moniq
          </span>
        </header>

        <section
          style={{
            background: "var(--moniq-card)",
            borderRadius: 22,
            padding: 24,
          }}
        >
          <AvatarUpload initialAvatarUrl={user.avatarUrl ?? null} />

          <ProfileNameForm initialName={user.name ?? ""} />

          <div style={{ marginBottom: 24 }}>
            <label style={{ color: "var(--moniq-muted)", fontSize: 13 }}>
              Электронная почта
            </label>

            <input
              type="email"
              defaultValue={user.email}
              readOnly
              style={{
                display: "block",
                width: "100%",
                marginTop: 8,
                padding: 14,
                borderRadius: 12,
                border: "1px solid var(--moniq-border)",
                background: "var(--moniq-input)",
                color: "var(--moniq-text)",
              }}
            />
          </div>



        </section>
      </div>
    </main>
  );
}
