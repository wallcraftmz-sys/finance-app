
"use client";

import { useEffect, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
};

export default function AssistantPage() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Привет! Я твой финансовый помощник Moniq. Можешь спросить меня о финансах.",
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [limitMessage, setLimitMessage] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [chat, loading]);

  async function send() {
    if (!message.trim() || loading || limitReached) return;

    const userMessage = message.trim();

    const newChat: ChatMessage[] = [
      ...chat,
      { role: "user", text: userMessage },
    ];

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

      if (!res.ok) {
        if (data.code === "AI_DAILY_LIMIT") {
          setLimitReached(true);
          setLimitMessage(
            data.error || "Дневной лимит AI-запросов исчерпан."
          );
          return;
        }

        setChat([
          ...newChat,
          {
            role: "ai",
            text: data.error || "Не удалось получить ответ.",
          },
        ]);

        return;
      }

      setChat([
        ...newChat,
        {
          role: "ai",
          text: data.reply || "Не удалось получить ответ.",
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
        position: "fixed",
        inset: 0,
        height: "100dvh",
        overflow: "hidden",
        background: "var(--moniq-bg)",
        color: "var(--moniq-text)",
        display: "flex",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          height: "100%",
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          padding: "16px 14px 88px",
          boxSizing: "border-box",
        }}
      >
        <header
          style={{
            flexShrink: 0,
            paddingBottom: "14px",
          }}
        >
          <div
            style={{
              fontSize: "13px",
              color: "var(--moniq-muted)",
              marginBottom: "4px",
            }}
          >
            moniq
          </div>

          <h1
            style={{
              fontSize: "26px",
              margin: 0,
            }}
          >
            AI помощник
          </h1>
        </header>

        <section
          style={{
            flex: "1 1 0",
            minHeight: 0,
            overflowY: "auto",
            overscrollBehavior: "contain",
            background: "var(--moniq-card)",
            border: "1px solid var(--moniq-border)",
            borderRadius: "22px",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            scrollbarWidth: "thin",
          }}
        >
          {chat.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                flexShrink: 0,
                justifyContent:
                  m.role === "user"
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <div
                style={{
                  maxWidth: "85%",
                  background:
                    m.role === "user"
                      ? "var(--moniq-accent)"
                      : "var(--moniq-input)",
                  color:
                    m.role === "user"
                      ? "#111111"
                      : "var(--moniq-text)",
                  border:
                    m.role === "user"
                      ? "none"
                      : "1px solid var(--moniq-border)",
                  borderRadius: "18px",
                  padding: "12px 14px",
                  lineHeight: 1.5,
                  fontSize: "14px",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "anywhere",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div
              style={{
                color: "var(--moniq-muted)",
                fontSize: "14px",
              }}
            >
              AI думает...
            </div>
          )}

          <div ref={messagesEndRef} />
        </section>

        {limitReached && (
          <div
            style={{
              flexShrink: 0,
              marginTop: "10px",
              padding: "12px",
              borderRadius: "14px",
              background: "var(--moniq-input)",
              border: "1px solid var(--moniq-accent)",
              color: "var(--moniq-text)",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            <strong>Дневной лимит исчерпан</strong>
            <div>{limitMessage}</div>
          </div>
        )}

        <section
          style={{
            flexShrink: 0,
            background: "var(--moniq-card)",
            border: "1px solid var(--moniq-border)",
            borderRadius: "20px",
            padding: "12px",
            marginTop: "10px",
          }}
        >
          <textarea
            className="moniq-chat-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              limitReached
                ? "Лимит на сегодня исчерпан"
                : "Напиши вопрос о финансах..."
            }
            disabled={loading || limitReached}
            rows={2}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "12px",
              borderRadius: "14px",
              border: "1px solid var(--moniq-border)",
              background: "var(--moniq-input)",
              color: "var(--moniq-text)",
              caretColor: "var(--moniq-text)",
              resize: "none",
              fontFamily: "Inter, sans-serif",
            }}
          />

          <button
            type="button"
            onClick={send}
            disabled={
              loading ||
              limitReached ||
              !message.trim()
            }
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "8px",
              background: "var(--moniq-accent)",
              border: "none",
              borderRadius: "14px",
              fontWeight: 800,
              color: "#111111",
              cursor:
                loading || limitReached
                  ? "not-allowed"
                  : "pointer",
              opacity:
                loading ||
                limitReached ||
                !message.trim()
                  ? 0.5
                  : 1,
            }}
          >
            {loading
              ? "Отправка..."
              : limitReached
              ? "Лимит исчерпан"
              : "Отправить"}
          </button>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}
