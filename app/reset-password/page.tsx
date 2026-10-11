"use client";

import { useState, useEffect, type FormEvent } from "react";

export default function ResetPasswordPage() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const value = params.get("token") || "";
    setToken(value);

    // Не оставляем секретную ссылку в адресной строке.
    if (value) {
      window.history.replaceState(null, "", "/reset-password");
    }
  }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 8) {
      setError("Минимум 8 символов");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка сброса пароля");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#0b0b0f",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
      fontFamily: "Inter, sans-serif",
    }}>
      <form onSubmit={submit} style={{
        width: "100%",
        maxWidth: 390,
        background: "#17171c",
        border: "1px solid #26262b",
        borderRadius: 22,
        padding: 24,
        display: "grid",
        gap: 16,
      }}>
        <h1>Новый пароль</h1>

        {success ? (
          <>
            <p style={{ color: "#86efac" }}>
              Пароль успешно изменён. Теперь можно войти.
            </p>
            <a href="/login" style={{ color: "#fbbf24" }}>
              Перейти ко входу
            </a>
          </>
        ) : (
          <>
            <p style={{ color: "#a0a0a8" }}>
              Создайте новый пароль для аккаунта Moniq.
            </p>

            <input
              type="password"
              placeholder="Новый пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              autoComplete="new-password"
              required
              style={inputStyle}
            />

            <input
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              minLength={8}
              autoComplete="new-password"
              required
              style={inputStyle}
            />

            {error && <p style={{ color: "#ff8a8a" }}>{error}</p>}

            {!token && (
              <p style={{ color: "#ff8a8a" }}>
                Ссылка отсутствует. Запросите новую.
              </p>
            )}

            <button disabled={loading || !token} style={{
              padding: 14,
              background: "#fbbf24",
              border: 0,
              borderRadius: 14,
              fontWeight: 800,
              cursor: "pointer",
              opacity: loading || !token ? 0.5 : 1,
            }}>
              {loading ? "Сохранение..." : "Сохранить новый пароль"}
            </button>

            <a href="/forgot-password" style={{ color: "#fbbf24" }}>
              Запросить новую ссылку
            </a>
          </>
        )}
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  padding: 14,
  borderRadius: 14,
  border: "1px solid #333",
  background: "#111114",
  color: "white",
};
