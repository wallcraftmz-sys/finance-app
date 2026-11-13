"use client";

import { useState } from "react";
import { translate, useMoniqLanguage } from "@/lib/moniq-language";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const language = useMoniqLanguage();
  const t = (ru: string, en: string, lv: string) => translate(language, ru, en, lv);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ошибка регистрации");
        return;
      }

      alert(t("Регистрация успешна", "Registration successful", "Reģistrācija veiksmīga"));
      router.push("/login");
    } catch (err) {
      setError(t("Ошибка сети", "Network error", "Tīkla kļūda"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0b0b0f 0%, #111111 100%)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Inter, sans-serif",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "390px",
          background: "#17171c",
          border: "1px solid #26262b",
          borderRadius: "22px",
          padding: "22px",
        }}
      >
        <h1 style={{ fontSize: "28px", marginTop: 0, marginBottom: "18px" }}>
          {t("Регистрация", "Registration", "Reģistrācija")}
        </h1>

        <div style={{ display: "grid", gap: "12px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid #333",
              background: "#111114",
              color: "white",
            }}
          />

          <input
            type="password"
            placeholder={t("Пароль", "Password", "Parole")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "14px",
              borderRadius: "14px",
              border: "1px solid #333",
              background: "#111114",
              color: "white",
            }}
          />

          {error ? (
            <div
              style={{
                color: "#ff8a8a",
                fontSize: "14px",
                background: "#2a1414",
                border: "1px solid #5a2a2a",
                padding: "10px 12px",
                borderRadius: "12px",
              }}
            >
              {error}
            </div>
          ) : null}

          <button
            onClick={handleRegister}
            disabled={loading}
            style={{
              width: "100%",
              padding: "14px",
              background: "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
              border: "none",
              borderRadius: "16px",
              fontWeight: 800,
              color: "#111",
              cursor: "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? t("Создание...", "Creating...", "Izveido...") : t("Создать аккаунт", "Create account", "Izveidot kontu")}
          </button>
          <div style={{ marginTop: "16px", textAlign: "center" }}>
  <a
    href="/privacy"
    style={{
      color: "#a0a0a8",
      textDecoration: "none",
      fontSize: "13px",
    }}
  >
    {t("Политика конфиденциальности", "Privacy policy", "Privātuma politika")}
  </a>
</div>
        </div>
      </div>
    </main>
  );
}