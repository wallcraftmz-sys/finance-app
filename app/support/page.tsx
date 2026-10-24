
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BottomNav from "@/components/BottomNav";

type SupportMessage = {
  id: string;
  message: string;
  role: "user" | "admin";
  createdAt: string;
};

export default function SupportPage() {
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const firstLoadRef = useRef(true);
  const lastMessageIdRef = useRef<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/support/get", {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Не удалось загрузить сообщения");
      }

      const data: unknown = await res.json();

      if (!Array.isArray(data)) {
        throw new Error("Неверный формат сообщений");
      }

      const nextMessages = data as SupportMessage[];

      setMessages(nextMessages);
      setError("");

      const lastId =
        nextMessages.length > 0
          ? nextMessages[nextMessages.length - 1].id
          : null;

      if (
        firstLoadRef.current ||
        lastId !== lastMessageIdRef.current
      ) {
        lastMessageIdRef.current = lastId;

        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({
            behavior: firstLoadRef.current ? "instant" : "smooth",
            block: "end",
          });

          firstLoadRef.current = false;
        });
      }

      await fetch("/api/support/mark-read", {
        method: "POST",
      }).catch(() => {});
    } catch {
      setError("Не удалось обновить сообщения.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();

    const interval = setInterval(() => {
      void load();
    }, 8000);

    return () => clearInterval(interval);
  }, [load]);

  async function send() {
    const message = text.trim();

    if (!message || sending) return;

    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Не удалось отправить сообщение"
        );
      }

      setText("");
      await load();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Ошибка сети или сервера"
      );
    } finally {
      setSending(false);
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
            Поддержка
          </h1>

          <p
            style={{
              fontSize: "13px",
              color: "var(--moniq-muted)",
              margin: "6px 0 0",
            }}
          >
            Напиши нам — ответ появится здесь.
          </p>
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
          {loading && messages.length === 0 ? (
            <div
              style={{
                color: "var(--moniq-muted)",
                fontSize: "14px",
              }}
            >
              Загрузка сообщений...
            </div>
          ) : messages.length === 0 ? (
            <div
              style={{
                color: "var(--moniq-muted)",
                fontSize: "14px",
                lineHeight: 1.6,
              }}
            >
              Пока сообщений нет. Напиши свой вопрос ниже.
            </div>
          ) : (
            messages.map((m) => {
              const isAdmin = m.role === "admin";

              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    flexShrink: 0,
                    justifyContent: isAdmin
                      ? "flex-start"
                      : "flex-end",
                  }}
                >
                  <div
                    style={{
                      maxWidth: "85%",
                      background: isAdmin
                        ? "var(--moniq-input)"
                        : "var(--moniq-accent)",
                      color: isAdmin
                        ? "var(--moniq-text)"
                        : "#111111",
                      border: isAdmin
                        ? "1px solid var(--moniq-border)"
                        : "none",
                      borderRadius: "18px",
                      padding: "12px 14px",
                      lineHeight: 1.5,
                      fontSize: "14px",
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        marginBottom: "5px",
                        opacity: 0.8,
                      }}
                    >
                      {isAdmin ? "Поддержка Moniq" : "Ты"}
                    </div>

                    <div>{m.message}</div>

                    <div
                      style={{
                        fontSize: "10px",
                        marginTop: "6px",
                        opacity: 0.7,
                      }}
                    >
                      {new Date(m.createdAt).toLocaleString(
                        "ru-RU",
                        {
                          day: "2-digit",
                          month: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          <div ref={messagesEndRef} />
        </section>

        {error && (
          <div
            role="alert"
            style={{
              flexShrink: 0,
              marginTop: "10px",
              padding: "10px 12px",
              borderRadius: "12px",
              background: "var(--moniq-input)",
              border: "1px solid var(--moniq-border)",
              color: "var(--moniq-text)",
              fontSize: "13px",
            }}
          >
            {error}
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
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Напиши сообщение..."
            disabled={sending}
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
              fontSize: "14px",
            }}
          />

          <button
            type="button"
            onClick={send}
            disabled={sending || !text.trim()}
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
                sending || !text.trim()
                  ? "not-allowed"
                  : "pointer",
              opacity:
                sending || !text.trim() ? 0.5 : 1,
            }}
          >
            {sending ? "Отправка..." : "Отправить"}
          </button>
        </section>

        <BottomNav />
      </div>
    </main>
  );
}
