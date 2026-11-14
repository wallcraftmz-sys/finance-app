"use client";

import { useMoniqI18n } from "@/lib/moniq-language";

import { useState } from "react";

export default function LogoutButton() {
  const { msg } = useMoniqI18n();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error(msg("Не удалось выйти из аккаунта"));
      }

      window.location.href = "/login";
    } catch {
      alert(msg("Ошибка выхода. Попробуй ещё раз."));
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      style={{
        width: "100%",
        padding: "20px 0",
        background: "transparent",
        border: "none",
        color: "var(--moniq-text)",
        textAlign: "left",
        fontSize: 16,
        fontWeight: 700,
        cursor: loading ? "wait" : "pointer",
      }}
    >
      ↪ {loading ? msg("Выходим...") : msg("Выйти из аккаунта")}
    </button>
  );
}
