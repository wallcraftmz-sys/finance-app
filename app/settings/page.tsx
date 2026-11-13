import { cookies } from "next/headers";
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

  const isPro = user.plan === "PRO";
  const selected = (await cookies()).get("moniq_language")?.value;
  const lang = selected === "en" || selected === "lv" ? selected : "ru";
  const tr = {
    ru: { settings: "Настройки", language: "Язык приложения", profile: "Мой профиль", profileDesc: "Фото, имя, электронная почта", currency: "Основная валюта", appearance: "Внешний вид", appearanceDesc: "Темы, фон, карточки, кнопки", security: "Безопасность", securityDesc: "Пароль и активные сеансы", delete: "Удалить аккаунт", free: "БЕСПЛАТНО", proActive: "У вас активен тариф Moniq PRO.", liteActive: "Вы используете бесплатный тариф Moniq LITE.", soon: "Moniq PRO — скоро", soonDesc: "Мы готовим расширенные возможности управления финансами. Информация о подписке появится позже." },
    en: { settings: "Settings", language: "App language", profile: "My profile", profileDesc: "Photo, name, email", currency: "Primary currency", appearance: "Appearance", appearanceDesc: "Themes, background, cards, buttons", security: "Security", securityDesc: "Password and active sessions", delete: "Delete account", free: "FREE", proActive: "Your Moniq PRO subscription is active.", liteActive: "You are using the free Moniq LITE plan.", soon: "Moniq PRO — coming soon", soonDesc: "We are preparing advanced financial management features. Subscription details will be available later." },
    lv: { settings: "Iestatījumi", language: "Lietotnes valoda", profile: "Mans profils", profileDesc: "Foto, vārds, e-pasts", currency: "Pamatvalūta", appearance: "Izskats", appearanceDesc: "Motīvi, fons, kartītes, pogas", security: "Drošība", securityDesc: "Parole un aktīvās sesijas", delete: "Dzēst kontu", free: "BEZMAKSAS", proActive: "Jūsu Moniq PRO abonements ir aktīvs.", liteActive: "Jūs izmantojat bezmaksas Moniq LITE plānu.", soon: "Moniq PRO — drīzumā", soonDesc: "Mēs gatavojam papildu finanšu pārvaldības iespējas. Informācija par abonementu būs pieejama vēlāk." },
  }[lang];
  const localizedSections = sections.map((section, index) => ({
    ...section,
    title: [tr.profile, tr.currency, tr.appearance, tr.security][index],
    description: [tr.profileDesc, "EUR — Euro (€)", tr.appearanceDesc, tr.securityDesc][index],
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
            {tr.settings}
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
          <label style={{ display: "block", fontSize: 16, fontWeight: 700, marginBottom: 12 }}>{tr.language}</label>
          <LanguageSelector initialLanguage={lang} />
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
              {isPro ? "PRO" : "БЕСПЛАТНО"}
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
              ? "У вас активен тариф Moniq PRO."
              : "Вы используете бесплатный тариф Moniq LITE."}
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
                🚀 {tr.soon}
              </div>

              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.6,
                  color: "var(--moniq-muted)",
                  margin: 0,
                }}
              >
                {tr.soonDesc}
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
            🗑 {tr.delete}
          </Link>
        </section>
      </div>
    </main>
  );
}
