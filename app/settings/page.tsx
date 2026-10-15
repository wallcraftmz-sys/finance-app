import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";

const sections = [
  {
    icon: "👤",
    title: "Мой профиль",
    description: "Фото, имя, электронная почта",
    href: "/settings/profile",
  },
  {
    icon: "💳",
    title: "Основная валюта",
    description: "EUR — Евро (€)",
    href: "/settings/currency",
  },
  {
    icon: "🎨",
    title: "Внешний вид",
    description: "Темы, фон, карточки, кнопки",
    href: "/settings/appearance",
  },
  {
    icon: "🛡️",
    title: "Безопасность",
    description: "Пароль и активные сеансы",
    href: "/settings/security",
  },
];

export default async function SettingsPage() {
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
        fontFamily: "Arial, sans-serif",
        padding: "32px 18px 100px",
      }}
    >
      <div style={{ maxWidth: 430, margin: "0 auto" }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 28,
          }}
        >
          <Link
            href="/dashboard"
            style={{ color: "var(--moniq-text)", textDecoration: "none", fontSize: 24 }}
          >
            ←
          </Link>

          <h1 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>
            Настройки
          </h1>

          <span style={{ color: "var(--moniq-accent)", fontWeight: 700 }}>
            Moniq
          </span>
        </header>

        <section
          style={{
            background: "var(--moniq-card)",
            borderRadius: 22,
            padding: "8px 18px",
            marginBottom: 18,
          }}
        >
          {sections.map((section, index) => (
            <Link
              key={section.href}
              href={section.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "20px 0",
                color: "var(--moniq-text)",
                textDecoration: "none",
                borderBottom:
                  index === sections.length - 1
                    ? "none"
                    : "1px solid var(--moniq-border)",
              }}
            >
              <span style={{ fontSize: 24 }}>{section.icon}</span>

              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700 }}>
                  {section.title}
                </div>

                <div
                  style={{
                    color: "var(--moniq-muted)",
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  {section.description}
                </div>
              </div>

              <span style={{ color: "var(--moniq-muted)", fontSize: 22 }}>
                ›
              </span>
            </Link>
          ))}
        </section>

        <section
          style={{
            background: "var(--moniq-card)",
            borderRadius: 22,
            padding: "8px 18px",
          }}
        >

          <Link
            href="/settings/delete-account"
            style={{
              display: "block",
              padding: "20px 0",
              borderTop: "1px solid var(--moniq-border)",
              color: "#ff655c",
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            🗑 Удалить аккаунт
          </Link>
        </section>
      </div>
    </main>
  );
}
