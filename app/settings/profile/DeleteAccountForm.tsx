"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteAccountForm() {
  const router = useRouter();

  const [opened, setOpened] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (loading || confirmation !== "УДАЛИТЬ") return;

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
          confirmation,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Не удалось удалить аккаунт");
      }

      router.replace("/login");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка сервера"
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
        Удаление аккаунта
      </h2>

      <p
        style={{
          color: "#aaaab4",
          fontSize: 14,
          lineHeight: 1.6,
        }}
      >
        При удалении аккаунта будут удалены ваши доходы,
        расходы, финансовые цели и история AI-чата.
        Это действие нельзя отменить.
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
          Удалить аккаунт
        </button>
      ) : (
        <form onSubmit={handleDelete}>
          <p style={{ color: "#ff818b", fontSize: 14 }}>
            Для подтверждения введите пароль и слово УДАЛИТЬ.
          </p>

          <label
            htmlFor="delete-password"
            style={{ fontSize: 13, color: "#aaaab4" }}
          >
            Текущий пароль
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
            Напишите УДАЛИТЬ
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
              confirmation !== "УДАЛИТЬ"
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
                loading || !password || confirmation !== "УДАЛИТЬ"
                  ? 0.5
                  : 1,
              cursor: "pointer",
            }}
          >
            {loading
              ? "Удаление..."
              : "Подтвердить удаление аккаунта"}
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
            Отмена
          </button>
        </form>
      )}
    </section>
  );
}
