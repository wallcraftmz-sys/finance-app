"use client";

import { useState } from "react";

type Props = {
  userId: string;
};

export default function DeleteConversationButton({ userId }: Props) {
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    const ok = window.confirm("Удалить всю переписку с этим пользователем?");
    if (!ok) return;

    try {
      setLoading(true);

      const res = await fetch("/api/admin/support/delete-conversation", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ошибка при удалении");
        return;
      }

      window.location.reload();
    } catch (error) {
      alert("Ошибка сети или сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={loading}
      style={{
        border: "none",
        borderRadius: 12,
        background: loading ? "#374151" : "#dc2626",
        color: "#fff",
        fontSize: 14,
        fontWeight: 700,
        padding: "10px 14px",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? "Удаление..." : "Удалить переписку"}
    </button>
  );
}