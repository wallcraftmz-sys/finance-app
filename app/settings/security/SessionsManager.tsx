"use client";

import { useCallback, useEffect, useState } from "react";

type Session = {
  id: string;
  createdAt: string;
  expiresAt: string;
  current: boolean;
};

export default function SessionsManager() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSessions = useCallback(async () => {
    try {
      const res = await fetch("/api/security/sessions", {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ошибка загрузки");
      }

      setSessions(data.sessions);
      setError("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка загрузки"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSessions();
  }, [loadSessions]);

  async function revoke(
    sessionId?: string,
    allOthers = false
  ) {
    const confirmed = window.confirm(
      allOthers
        ? "Завершить все остальные сеансы?"
        : "Завершить выбранный сеанс?"
    );

    if (!confirmed || busy) return;

    setBusy(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        "/api/security/sessions/revoke",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(
            allOthers ? { allOthers: true } : { sessionId }
          ),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Не удалось завершить сеанс"
        );
      }

      setMessage(
        `Завершено сеансов: ${data.revoked}`
      );

      await loadSessions();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка"
      );
    } finally {
      setBusy(false);
    }
  }

  const otherSessions = sessions.filter(
    (session) => !session.current
  );

  return (
    <section
      style={{
        background: "var(--moniq-card)",
        border: "1px solid var(--moniq-border)",
        borderRadius: 22,
        padding: 24,
        marginTop: 18,
      }}
    >
      <h2 style={{ fontSize: 19, marginTop: 0 }}>
        💻 Активные сеансы
      </h2>

      <p
        style={{
          color: "var(--moniq-muted)",
          fontSize: 14,
        }}
      >
        Здесь отображаются все активные входы в Moniq.
      </p>

      {loading && <p>Загрузка сеансов...</p>}

      {!loading && sessions.length === 0 && !error && (
        <p>Активных сеансов не найдено.</p>
      )}

      {sessions.map((session) => (
        <div
          key={session.id}
          style={{
            background: "var(--moniq-input)",
            border: "1px solid var(--moniq-border)",
            borderRadius: 14,
            padding: 16,
            marginTop: 12,
          }}
        >
          <div style={{ fontWeight: 700 }}>
            {session.current
              ? "🟢 Это устройство"
              : "📱 Другое устройство"}
          </div>

          <p style={{ fontSize: 13 }}>
            Вход:{" "}
            {new Date(session.createdAt).toLocaleString(
              "ru-RU"
            )}
          </p>

          <p style={{ fontSize: 13 }}>
            Действует до:{" "}
            {new Date(session.expiresAt).toLocaleString(
              "ru-RU"
            )}
          </p>

          {!session.current && (
            <button
              type="button"
              disabled={busy}
              onClick={() => revoke(session.id)}
              style={{
                padding: "12px 16px",
                background: "#842b35",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                cursor: busy ? "wait" : "pointer",
              }}
            >
              Завершить сеанс
            </button>
          )}
        </div>
      ))}

      {otherSessions.length > 0 && (
        <button
          type="button"
          disabled={busy}
          onClick={() => revoke(undefined, true)}
          style={{
            width: "100%",
            padding: 15,
            marginTop: 18,
            borderRadius: 12,
            background: "var(--moniq-accent)",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            cursor: busy ? "wait" : "pointer",
          }}
        >
          Выйти на всех других устройствах
        </button>
      )}

      {error && (
        <p role="alert" style={{ color: "#e5484d" }}>
          {error}
        </p>
      )}

      {message && (
        <p role="status" style={{ color: "var(--moniq-text)" }}>
          {message}
        </p>
      )}
    </section>
  );
}
