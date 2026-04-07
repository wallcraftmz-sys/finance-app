"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SupportMessage = {
  id: string;
  message: string;
  role: "user" | "admin";
  createdAt: string;
};

export default function SupportPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/support/get", { cache: "no-store" });
      const data = await res.json();

      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        setMessages([]);
      }
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, []);

  const send = async () => {
    if (!text.trim()) {
      alert("Напиши сообщение");
      return;
    }

    try {
      setSending(true);

      const res = await fetch("/api/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Ошибка при отправке");
        return;
      }

      setText("");
      await load();
    } catch {
      alert("Ошибка сети или сервера");
    } finally {
      setSending(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0f19",
        color: "#fff",
        padding: "24px 16px 120px",
      }}
    >
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 18,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              Поддержка
            </h1>

            <p
              style={{
                margin: "8px 0 0 0",
                color: "#9ca3af",
                fontSize: 15,
                lineHeight: 1.5,
              }}
            >
              Здесь ты можешь написать в поддержку и получить ответ от администратора.
            </p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            style={{
              border: "none",
              borderRadius: 12,
              background: "#1f2937",
              color: "#fff",
              fontSize: 15,
              fontWeight: 600,
              padding: "12px 18px",
              cursor: "pointer",
            }}
          >
            ← Назад
          </button>
        </div>

        <section
          style={{
            background: "rgba(17, 24, 39, 0.96)",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 20,
            boxShadow: "0 18px 45px rgba(0,0,0,0.35)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: 18,
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <b style={{ fontSize: 16 }}>Чат поддержки</b>
          </div>

          <div
            style={{
              minHeight: 360,
              maxHeight: 520,
              overflowY: "auto",
              padding: 18,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {loading ? (
              <div style={{ color: "#9ca3af" }}>Загрузка сообщений...</div>
            ) : messages.length === 0 ? (
              <div
                style={{
                  color: "#9ca3af",
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
                      justifyContent: isAdmin ? "flex-start" : "flex-end",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "78%",
                        padding: "12px 14px",
                        borderRadius: 16,
                        background: isAdmin
                          ? "#1f2937"
                          : "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                        color: isAdmin ? "#fff" : "#111827",
                        boxShadow: "0 8px 18px rgba(0,0,0,0.18)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          marginBottom: 6,
                          opacity: 0.85,
                        }}
                      >
                        {isAdmin ? "Поддержка" : "Ты"}
                      </div>

                      <div
                        style={{
                          whiteSpace: "pre-wrap",
                          lineHeight: 1.5,
                          fontSize: 15,
                        }}
                      >
                        {m.message}
                      </div>

                      <div
                        style={{
                          marginTop: 8,
                          fontSize: 11,
                          opacity: 0.75,
                        }}
                      >
                        {new Date(m.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div
            style={{
              padding: 18,
              borderTop: "1px solid rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <label
              htmlFor="support-message"
              style={{
                display: "block",
                fontSize: 14,
                fontWeight: 600,
                marginBottom: 10,
                color: "#e5e7eb",
              }}
            >
              Новое сообщение
            </label>

            <textarea
              id="support-message"
              placeholder="Напиши сообщение..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={5}
              style={{
                width: "100%",
                resize: "vertical",
                minHeight: 120,
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.10)",
                background: "#0f172a",
                color: "#fff",
                padding: "14px 16px",
                fontSize: 15,
                lineHeight: 1.5,
                outline: "none",
                boxSizing: "border-box",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 14,
                marginTop: 14,
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  color: "#9ca3af",
                  fontSize: 13,
                }}
              >
                Ответ администратора появится здесь же в чате.
              </span>

              <button
                onClick={send}
                disabled={sending}
                style={{
                  border: "none",
                  borderRadius: 14,
                  background: sending
                    ? "#374151"
                    : "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)",
                  color: "#111827",
                  fontSize: 15,
                  fontWeight: 700,
                  padding: "13px 22px",
                  cursor: sending ? "not-allowed" : "pointer",
                  minWidth: 160,
                  boxShadow: "0 10px 24px rgba(0,0,0,0.25)",
                }}
              >
                {sending ? "Отправка..." : "Отправить"}
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}