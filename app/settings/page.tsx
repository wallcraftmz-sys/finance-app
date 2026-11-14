import { getMoniqI18n } from "@/lib/moniq-language-server";
import LanguageSelector from "./LanguageSelector";

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
    description: "",
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

  const isPro = user.plan === "PRO";
  const { msg, locale } = await getMoniqI18n();
  const currency = user.currency || "EUR";
  const currencyName = new Intl.DisplayNames(locale, { type: "currency" }).of(currency);
  const localizedSections = sections.map((section) => ({
    ...section,
    title: msg(section.title),
    description: section.href === "/settings/currency"
      ? `${currency} — ${currencyName ?? currency}`
      : msg(section.description),
  }));

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
            style={{
              color: "var(--moniq-text)",
              textDecoration: "none",
              fontSize: 24,
            }}
          >
            ←
          </Link>

          <h1
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {msg("Настройки")}
          </h1>

          <span
            style={{
              color: "var(--moniq-accent)",
              fontWeight: 700,
            }}
          >
            Moniq
          </span>
        </header>

        {/* Настройки аккаунта */}
        <section
          style={{
            background: "var(--moniq-card)",
            borderRadius: 22,
            padding: "8px 18px",
            marginBottom: 18,
          }}
        >
          {localizedSections.map((section, index) => (
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
              <span style={{ fontSize: 24 }}>
                {section.icon}
              </span>

              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                  }}
                >
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

              <span
                style={{
                  color: "var(--moniq-muted)",
                  fontSize: 22,
                }}
              >
                ›
              </span>
            </Link>
          ))}
        </section>

        <section style={{ background: "var(--moniq-card)", borderRadius: 22, padding: 18, marginBottom: 18 }}>
          <label style={{ display: "block", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{msg("Язык приложения")}</label>
          <LanguageSelector />
        </section>

        {/* Тариф Moniq */}
        <section
          style={{
            background: "var(--moniq-card)",
            borderRadius: 22,
            padding: 20,
            marginBottom: 18,
            border: isPro
              ? "1px solid var(--moniq-accent)"
              : "1px solid var(--moniq-border)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              ✨ Moniq {isPro ? "PRO" : "LITE"}
            </span>

            <span
              style={{
                padding: "6px 10px",
                borderRadius: 20,
                background: "var(--moniq-bg)",
                color: "var(--moniq-accent)",
                fontSize: 11,
                fontWeight: 700,
              }}
            >
              {isPro ? "PRO" : msg("БЕСПЛАТНО")}
            </span>
          </div>

          <p
            style={{
              fontSize: 13,
              lineHeight: 1.6,
              color: "var(--moniq-muted)",
              margin: 0,
            }}
          >
            {isPro
              ? msg("У вас активен тариф Moniq PRO.")
              : msg("Вы используете бесплатный тариф Moniq LITE.")}
          </p>

          {!isPro && (
            <div
              style={{
                marginTop: 18,
                paddingTop: 16,
                borderTop: "1px solid var(--moniq-border)",
              }}
            >
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  marginBottom: 8,
                }}
              >
                🚀 {msg("Moniq PRO — скоро")}
              </div>

              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "var(--moniq-muted)",
                  margin: 0,
                }}
              >
                {msg("Мы готовим расширенные возможности управления финансами. Информация о подписке появится позже.")}
              </p>
            </div>
          )}
        </section>

        {/* Управление аккаунтом */}
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
              color: "#ff655c",
              fontSize: 16,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            🗑 {msg("Удалить аккаунт")}
          </Link>
        </section>
      </div>
    </main>
  );
}
