"use client";

import Link from "next/link";
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

  return (
    <nav
      aria-label="Основная навигация"
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
      {links.map((link) => {
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
              {link.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
