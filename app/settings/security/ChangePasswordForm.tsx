"use client";

import { useState } from "react";

export default function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (saving) return;

    setSaving(true);
    setMessage("");
    setSuccess(false);

    try {
      const response = await fetch("/api/security/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка изменения пароля");
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setSuccess(true);
      setMessage("Пароль успешно изменён!");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Ошибка сервера"
      );
    } finally {
      setSaving(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    border: "1px solid var(--moniq-border)",
    background: "var(--moniq-input)",
    color: "var(--moniq-text)",
    boxSizing: "border-box",
    fontSize: 15,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    color: "var(--moniq-muted)",
    fontSize: 13,
    marginBottom: 8,
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 28 }}>
      <h2 style={{ fontSize: 19, marginBottom: 20 }}>
        Изменить пароль
      </h2>

      <div style={{ marginBottom: 18 }}>
        <label htmlFor="current-password" style={labelStyle}>
          Текущий пароль
        </label>
        <input
          id="current-password"
          type="password"
          autoComplete="current-password"
          required
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 18 }}>
        <label htmlFor="new-password" style={labelStyle}>
          Новый пароль
        </label>
        <input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          maxLength={72}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label htmlFor="confirm-password" style={labelStyle}>
          Подтвердите новый пароль
        </label>
        <input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={inputStyle}
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        style={{
          width: "100%",
          padding: 17,
          border: "none",
          borderRadius: 14,
          background: "var(--moniq-accent)",
          color: "#000000",
          fontSize: 17,
          fontWeight: 700,
          cursor: saving ? "wait" : "pointer",
          opacity: saving ? 0.65 : 1,
        }}
      >
        {saving ? "Сохранение..." : "Изменить пароль"}
      </button>

      {message && (
        <p
          role="status"
          style={{
            color: success ? "#45d6a0" : "#ff655c",
            textAlign: "center",
            fontSize: 14,
            marginTop: 14,
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
