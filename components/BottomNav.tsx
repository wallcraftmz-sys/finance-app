"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Главная" },
  { href: "/analytics", label: "Аналитика" },
  { href: "/goals", label: "Цель" },
  { href: "/income", label: "Доход" },
  { href: "/expenses", label: "Расход" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Основная навигация"
      style={{
        position: "fixed",
        bottom: "max(16px, env(safe-area-inset-bottom))",
        left: "50%",
        transform: "translateX(-50%)",
        width: "calc(100% - 24px)",
        maxWidth: 430,
        display: "grid",
        gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
        background: "var(--moniq-card)",
        border: "1px solid var(--moniq-border)",
        borderRadius: 22,
        overflow: "hidden",
        boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
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
              padding: "16px 2px",
              textAlign: "center",
              fontSize: 13,
              fontWeight: active ? 700 : 500,
              color: active
                ? "var(--moniq-accent)"
                : "var(--moniq-text)",
              background: active
                ? "var(--moniq-input)"
                : "transparent",
              textDecoration: "none",
            }}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
