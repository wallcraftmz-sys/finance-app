"use client";

import { useState } from "react";

type Props = {
  userId: string;
};

export default function AdminSupportReplyBox({ userId }: Props) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const sendReply = async () => {
    if (!message.trim()) {
      alert("Напиши ответ");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/support", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ошибка при отправке ответа");
        return;
      }

      setMessage("");
      window.location.reload();
    } catch (error) {
      alert("Ошибка сети или сервера");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      style={{
        marginTop: 16,
        paddingTop: 16,
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontSize: 14,
          fontWeight: 600,
          color: "#e5e7eb",
        }}
      >
        Ответ пользователю
      </label>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Напиши ответ..."
        rows={4}
        style={{
          width: "100%",
          borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.10)",
          background: "#0f172a",
          color: "#fff",
          padding: "14px 16px",
          fontSize: 15,
          lineHeight: 1.5,
          outline: "none",
          boxSizing: "border-box",
          resize: "vertical",
        }}
      />

      <div style={{ marginTop: 12 }}>
        <button
          type="button"
          onClick={sendReply}
          disabled={sending}
          style={{
            border: "none",
            borderRadius: 12,
            background: sending
              ? "#374151"
              : "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
            color: "#111827",
            fontSize: 15,
            fontWeight: 700,
            padding: "12px 18px",
            cursor: sending ? "not-allowed" : "pointer",
            minWidth: 150,
          }}
        >
          {sending ? "Отправка..." : "Ответить"}
        </button>
      </div>
    </div>
  );
}