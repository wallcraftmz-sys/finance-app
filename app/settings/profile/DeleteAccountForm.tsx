"use client";

import { useMoniqI18n } from "@/lib/moniq-language";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountForm() {
  const { errorMessage, msg } = useMoniqI18n();
  const confirmationWord = msg("УДАЛИТЬ");
  const router = useRouter();

  const [opened, setOpened] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading || confirmation !== confirmationWord) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/profile/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password,
          confirmation: "УДАЛИТЬ",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(errorMessage(data.error, msg("Не удалось удалить аккаунт")));
      }

      router.replace("/login");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : msg("Ошибка сервера")
      );
      setLoading(false);
    }
  }

  return (
    <section
      style={{
        marginTop: 24,
        padding: 24,
        borderRadius: 22,
        background: "#1b1b21",
        border: "1px solid #51252b",
      }}
    >
      <h2 style={{ fontSize: 19, margin: "0 0 12px" }}>
        {msg("Удаление аккаунта")}
      </h2>

      <p
        style={{
          color: "#aaaab4",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        {msg("При удалении аккаунта будут удалены ваши доходы, расходы, финансовые цели и история AI-чата. Это действие нельзя отменить.")}
      </p>

      {!opened ? (
        <button
          type="button"
          onClick={() => setOpened(true)}
          style={{
            width: "100%",
            padding: 15,
            borderRadius: 12,
            background: "#c73542",
            border: "none",
            color: "#ffffff",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {msg("Удалить аккаунт")}
        </button>
      ) : (
        <form onSubmit={handleDelete}>
          <p style={{ color: "#ff818b", fontSize: 14 }}>
            {msg("Для подтверждения введите пароль и слово {word}.", { word: confirmationWord })}
          </p>

          <label
            htmlFor="delete-password"
            style={{ fontSize: 13, color: "#aaaab4" }}
          >
            {msg("Текущий пароль")}
          </label>

          <input
            id="delete-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginTop: 8,
              marginBottom: 18,
              padding: 14,
              background: "#111116",
              border: "1px solid #34343c",
              borderRadius: 12,
              color: "#ffffff",
            }}
          />

          <label
            htmlFor="delete-confirmation"
            style={{ fontSize: 13, color: "#aaaab4" }}
          >
            {msg("Напишите {word}", { word: confirmationWord })}
          </label>

          <input
            id="delete-confirmation"
            type="text"
            autoComplete="off"
            required
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            style={{
              width: "100%",
              boxSizing: "border-box",
              marginTop: 8,
              marginBottom: 18,
              padding: 14,
              background: "#111116",
              border: "1px solid #34343c",
              borderRadius: 12,
              color: "#ffffff",
            }}
          />

          {error && (
            <p role="alert" style={{ color: "#ff818b" }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={
              loading ||
              !password ||
              confirmation !== confirmationWord
            }
            style={{
              width: "100%",
              padding: 15,
              borderRadius: 12,
              background: "#c73542",
              border: "none",
              color: "#ffffff",
              fontWeight: 700,
              opacity:
                loading || !password || confirmation !== confirmationWord
                  ? 0.5
                  : 1,
              cursor: "pointer",
            }}
          >
            {loading
              ? msg("Удаление...")
              : msg("Подтвердить удаление аккаунта")}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setOpened(false);
              setPassword("");
              setConfirmation("");
              setError("");
            }}
            style={{
              width: "100%",
              padding: 14,
              marginTop: 10,
              borderRadius: 12,
              border: "1px solid #34343c",
              background: "transparent",
              color: "#ffffff",
              cursor: "pointer",
            }}
          >
            {msg("Отмена")}
          </button>
        </form>
      )}
    </section>
  );
}
