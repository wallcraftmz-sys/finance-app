"use client";

import { useMoniqI18n } from "@/lib/moniq-language";

import { useState } from "react";

export default function ProfileNameForm({
  initialName,
}: {
  initialName: string;
}) {
  const { errorMessage, msg } = useMoniqI18n();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function saveName() {
    setSaving(true);
    setMessage("");

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(errorMessage(data.error, msg("Ошибка сохранения")));
      }

      setName(data.user.name);
      setMessage(msg("Имя успешно сохранено!"));
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : msg("Ошибка сохранения")
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <label
        htmlFor="profile-name"
        style={{ color: "var(--moniq-muted)", fontSize: 13 }}
      >
        {msg("Имя пользователя")}
      </label>

      <input
        id="profile-name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength={60}
        placeholder={msg("Введите ваше имя")}
        style={{
          display: "block",
          boxSizing: "border-box",
          width: "100%",
          marginTop: 8,
          padding: 14,
          borderRadius: 12,
          border: "1px solid var(--moniq-border)",
          background: "var(--moniq-input)",
          color: "var(--moniq-text)",
          fontSize: 16,
        }}
      />

      <button
        type="button"
        onClick={saveName}
        disabled={saving || name.trim().length < 2}
        style={{
          width: "100%",
          marginTop: 18,
          padding: 15,
          borderRadius: 14,
          border: "none",
          background: "var(--moniq-accent)",
          color: "#111111",
          fontSize: 16,
          fontWeight: 800,
          cursor: "pointer",
          opacity: saving ? 0.6 : 1,
        }}
      >
        {saving ? msg("Сохраняем...") : msg("Сохранить изменения")}
      </button>

      {message && (
        <p
          role="status"
          style={{
            textAlign: "center",
            color: message === msg("Имя успешно сохранено!") ? "#45d6a0" : "#ff655c",
            fontSize: 13,
            marginTop: 12,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}
