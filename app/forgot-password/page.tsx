"use client";

import { useState, type FormEvent } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка отправки");
        return;
      }

      setSuccess(data.message);
    } catch {
      setError("Ошибка соединения");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={styles.main}>
      <form onSubmit={submit} style={styles.card}>
        <h1>Восстановление пароля</h1>
        <p style={styles.description}>
          Введите электронную почту вашего аккаунта Moniq.
          Мы отправим ссылку для создания нового пароля.
        </p>

        <input
          type="email"
          placeholder="Электронная почта"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          style={styles.input}
        />

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <button disabled={loading} style={styles.button}>
          {loading ? "Отправка..." : "Отправить ссылку"}
        </button>

        <a href="/login" style={styles.link}>Вернуться ко входу</a>
      </form>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: "100vh",
    background: "#0b0b0f",
    color: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    fontFamily: "Inter, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: 390,
    background: "#17171c",
    border: "1px solid #26262b",
    borderRadius: 22,
    padding: 24,
    display: "grid",
    gap: 16,
  },
  description: { color: "#a0a0a8", lineHeight: 1.6 },
  input: {
    padding: 14,
    borderRadius: 14,
    border: "1px solid #333",
    background: "#111114",
    color: "white",
  },
  button: {
    padding: 14,
    background: "#fbbf24",
    color: "#111",
    border: 0,
    borderRadius: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
  link: { color: "#fbbf24", textAlign: "center" },
  error: { color: "#ff8a8a" },
  success: { color: "#86efac" },
};
