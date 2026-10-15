"use client";

import Link from "next/link";
import { useMoniqTheme } from "@/components/theme/ThemeProvider";

const accentColors = [
  { id: "orange", name: "Оранжевый", color: "#f59e0b" },
  { id: "blue", name: "Синий", color: "#3b82f6" },
  { id: "purple", name: "Фиолетовый", color: "#a855f7" },
  { id: "green", name: "Зелёный", color: "#22c55e" },
  { id: "pink", name: "Розовый", color: "#ec4899" },
] as const;

export default function AppearancePage() {
  const { theme, accent, setTheme, setAccent } = useMoniqTheme();

  const dark = theme === "dark";

  return (
    <main
      style={{
        minHeight: "100vh",
        background: dark ? "#0a0a0a" : "#f5f5f7",
        color: dark ? "#ffffff" : "#171717",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <Link
          href="/settings"
          style={{
            color: dark ? "#aaaaaa" : "#555555",
            textDecoration: "none",
          }}
        >
          ← Назад к настройкам
        </Link>

        <h1 style={{ fontSize: 30, marginTop: 30 }}>
          Внешний вид
        </h1>

        <p style={{ color: dark ? "#aaaaaa" : "#666666" }}>
          Настрой оформление Moniq под себя
        </p>

        <section
          style={{
            marginTop: 30,
            background: dark ? "#19191f" : "#ffffff",
            padding: 24,
            borderRadius: 20,
          }}
        >
          <h2 style={{ fontSize: 20, marginTop: 0 }}>
            Тема приложения
          </h2>

          <div style={{ display: "flex", gap: 12 }}>
            {(["dark", "light"] as const).map((value) => (
              <button
                key={value}
                onClick={() => setTheme(value)}
                style={{
                  flex: 1,
                  padding: 18,
                  borderRadius: 14,
                  cursor: "pointer",
                  background:
                    value === "dark" ? "#27272f" : "#eeeeee",
                  color:
                    value === "dark" ? "#ffffff" : "#171717",
                  border:
                    theme === value
                      ? "2px solid var(--moniq-accent, #f59e0b)"
                      : "2px solid transparent",
                  fontWeight: 700,
                }}
              >
                {value === "dark" ? "🌙 Тёмная" : "☀️ Светлая"}
              </button>
            ))}
          </div>
        </section>

        <section
          style={{
            marginTop: 20,
            background: dark ? "#19191f" : "#ffffff",
            padding: 24,
            borderRadius: 20,
          }}
        >
          <h2 style={{ fontSize: 20, marginTop: 0 }}>
            Основной цвет
          </h2>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            {accentColors.map((item) => (
              <button
                key={item.id}
                title={item.name}
                aria-label={item.name}
                aria-pressed={accent === item.id}
                onClick={() => setAccent(item.id)}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: item.color,
                  border:
                    accent === item.id
                      ? "3px solid " + (dark ? "#ffffff" : "#171717")
                      : "3px solid transparent",
                  cursor: "pointer",
                  fontSize: 22,
                  color: "#ffffff",
                }}
              >
                {accent === item.id ? "✓" : ""}
              </button>
            ))}
          </div>
        </section>

        <p
          style={{
            marginTop: 24,
            fontSize: 13,
            color: dark ? "#999999" : "#666666",
          }}
        >
          Настройки сохраняются автоматически в этом браузере.
          Подключение оформления к остальным страницам — следующий этап.
        </p>
      </div>
    </main>
  );
}
