"use client";

import { useState } from "react";
import Link from "next/link";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export default function AssistantPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Привет. Я твой финансовый помощник. Можешь спросить меня, например: 'как мне накопить 500€?', 'на что у меня уходит больше всего денег?' или 'как распределить бюджет?'",
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function send() {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();
    const newChat: ChatMessage[] = [...chat, { role: "user", text: userMessage }];
    setChat(newChat);
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await res.json();

      setChat([
        ...newChat,
        {
          role: "ai",
          text: data.reply || "Пока не удалось получить ответ.",
        },
      ]);
    } catch {
      setChat([
        ...newChat,
        {
          role: "ai",
          text: "Ошибка сети. Попробуй ещё раз.",
        },
      ]);
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
        fontFamily: "Inter, sans-serif",
        padding: "20px 0 96px",
      }}
    >
      <div
        style={{
          width: "390px",
          padding: "18px",
          borderRadius: "24px",
        }}
      >
        <div
          style={{
            marginBottom: "18px",
          }}
        >
          <div style={{ fontSize: "13px", color: "#8f8f95", marginBottom: "4px" }}>
            FinTrack
          </div>
          <h1 style={{ fontSize: "28px", margin: 0, fontWeight: 700 }}>
            AI помощник
          </h1>
        </div>

        <section
          style={{
            background: "#17171c",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "16px",
            marginBottom: "16px",
            minHeight: "420px",
            display: "grid",
            gap: "12px",
            alignContent: "start",
          }}
        >
          {chat.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: m.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  background: m.role === "user" ? "#f59e0b" : "#111114",
                  color: m.role === "user" ? "#111" : "white",
                  border: m.role === "user" ? "none" : "1px solid #24242a",
                  borderRadius: "18px",
                  padding: "12px 14px",
                  lineHeight: 1.5,
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading ? (
            <div style={{ color: "#8f8f95", fontSize: "14px" }}>
              AI думает...
            </div>
          ) : null}
        </section>

        <section
          style={{
            background: "#17171c",
            border: "1px solid #26262b",
            borderRadius: "22px",
            padding: "14px",
            marginBottom: "16px",
          }}
        >
          <div style={{ display: "grid", gap: "10px" }}>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Например: как мне накопить 500€ за 3 месяца?"
              rows={4}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "14px",
                border: "1px solid #333",
                background: "#111114",
                color: "white",
                resize: "none",
                fontFamily: "Inter, sans-serif",
              }}
            />

            <button
              onClick={send}
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
              {loading ? "Отправка..." : "Отправить"}
            </button>
          </div>
        </section>

        <div
          style={{
            position: "fixed",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "390px",
            background: "rgba(20,20,24,0.95)",
            border: "1px solid #2a2a30",
            borderRadius: "22px",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr",
            overflow: "hidden",
            backdropFilter: "blur(12px)",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            Главная
          </Link>

          <Link
            href="/analytics"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            Аналитика
          </Link>

          <Link
            href="/goals"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            Цель
          </Link>

          <Link
            href="/income"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            Доход
          </Link>

          <Link
            href="/expenses"
            style={{
              padding: "14px 10px",
              textAlign: "center",
              color: "white",
              textDecoration: "none",
            }}
          >
            Расход
          </Link>
        </div>
      </div>
    </main>
  );
}