"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);

    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Не удалось выйти из аккаунта");
      }

      window.location.href = "/login";
    } catch {
      alert("Ошибка выхода. Попробуй ещё раз.");
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
      ↪ {loading ? "Выходим..." : "Выйти из аккаунта"}
    </button>
  );
}
