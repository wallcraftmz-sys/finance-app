"use client";

import { useState } from "react";

export default function SupportPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!email || !message) {
      alert("Заполни email и сообщение");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ошибка при отправке");
        return;
      }

      alert("Отправлено");
      setEmail("");
      setMessage("");
    } catch (error) {
      alert("Ошибка сети или сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Support</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: 300, padding: 8 }}
      />

      <br />
      <br />

      <textarea
        placeholder="Сообщение"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={6}
        style={{ width: 300, padding: 8 }}
      />

      <br />
      <br />

      <button onClick={send} disabled={loading}>
        {loading ? "Отправка..." : "Отправить"}
      </button>
    </div>
  );
}