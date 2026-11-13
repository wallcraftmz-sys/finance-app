"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Главная", icon: "⌂" },
  { href: "/analytics", label: "Аналитика", icon: "▥" },
  { href: "/goals", label: "Цели", icon: "◎" },
  { href: "/income", label: "Доходы", icon: "+" },
  { href: "/expenses", label: "Расходы", icon: "−" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const [lang, setLang] = useState<"ru" | "en" | "lv">("ru");
  useEffect(() => {
    const found = document.cookie.match(/(?:^|; )moniq_language=(ru|en|lv)(?:;|$)/)?.[1];
    setLang(found === "en" || found === "lv" ? found : "ru");
  }, []);
  const labels = {
    ru: ["Главная", "Аналитика", "Цели", "Доходы", "Расходы"],
    en: ["Home", "Analytics", "Goals", "Income", "Expenses"],
    lv: ["Sākums", "Analītika", "Mērķi", "Ienākumi", "Izdevumi"],
  }[lang];

  return (
    <nav
      aria-label={lang === "en" ? "Main navigation" : lang === "lv" ? "Galvenā navigācija" : "Основная навигация"}
      style={{
        position: "fixed",
        bottom: "max(12px, env(safe-area-inset-bottom))",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 24px)",
        maxWidth: 430,
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        background: "var(--moniq-card)",
        border: "1px solid var(--moniq-border)",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
        zIndex: 100,
      }}
    >
      {links.map((link, index) => {
        const active =
          pathname === link.href ||
          pathname.startsWith(link.href + "/");

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            style={{
              minWidth: 0,
              padding: "10px 1px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              color: active
                ? "var(--moniq-accent)"
                : "var(--moniq-muted)",
              background: active
                ? "var(--moniq-input)"
                : "transparent",
              textDecoration: "none",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontSize: 22,
                lineHeight: 1,
                fontWeight: 700,
              }}
            >
              {link.icon}
            </span>

            <span
              style={{
                fontSize: 10,
                fontWeight: active ? 700 : 500,
                whiteSpace: "nowrap",
              }}
            >
              {labels[index]}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
