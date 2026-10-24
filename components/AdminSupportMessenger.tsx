
"use client";

import { useEffect, useRef, useState } from "react";
import AdminSupportReplyBox from "@/components/AdminSupportReplyBox";
import DeleteConversationButton from "@/components/DeleteConversationButton";

type SupportMessage = {
  id: string;
  role: string;
  message: string;
  createdAt: string;
};

type Conversation = {
  userId: string;
  email: string;
  items: SupportMessage[];
  lastCreatedAt: string;
};

type Props = {
  conversations: Conversation[];
};

export default function AdminSupportMessenger({
  conversations,
}: Props) {
  const [liveConversations, setLiveConversations] =
    useState<Conversation[]>(conversations);

  const [selectedId, setSelectedId] = useState<string | null>(
    null
  );

  const messagesRef = useRef<HTMLDivElement>(null);

  // Автоматически обновляем переписки каждые 5 секунд
  useEffect(() => {
    let active = true;

    const updateConversations = async () => {
      try {
        const response = await fetch(
          "/api/admin/support/conversations",
          { cache: "no-store" }
        );

        if (!response.ok) return;

        const data: Conversation[] = await response.json();

        if (active && Array.isArray(data)) {
          setLiveConversations(data);
        }
      } catch (error) {
        console.error(
          "Ошибка обновления поддержки:",
          error
        );
      }
    };

    const interval = window.setInterval(
      updateConversations,
      5000
    );

    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, []);

  // Находим выбранную переписку
  const selected = liveConversations.find(
    (conversation) => conversation.userId === selectedId
  );

  const lastMessageId =
    selected?.items[selected.items.length - 1]?.id ?? null;

  // Прокручиваем чат вниз при выборе или новом сообщении
  useEffect(() => {
    if (!selectedId) return;

    const container = messagesRef.current;

    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, [selectedId, lastMessageId]);

  return (
    <div className="moniq-admin-messenger">
      {/* Список обращений */}
      <aside
        className={`moniq-admin-inbox ${
          selected ? "moniq-admin-mobile-hidden" : ""
        }`}
      >
        <div className="moniq-admin-inbox-header">
          <h2>Обращения</h2>
          <span>{liveConversations.length}</span>
        </div>

        {liveConversations.length === 0 ? (
          <p className="moniq-admin-empty">
            Пока обращений нет.
          </p>
        ) : (
          liveConversations.map((conversation) => {
            const last =
              conversation.items[
                conversation.items.length - 1
              ];

            return (
              <button
                key={conversation.userId}
                type="button"
                className={`moniq-admin-conversation ${
                  selectedId === conversation.userId
                    ? "moniq-admin-conversation-active"
                    : ""
                }`}
                onClick={() =>
                  setSelectedId(conversation.userId)
                }
              >
                <div className="moniq-admin-avatar">
                  {conversation.email
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="moniq-admin-conversation-info">
                  <strong>{conversation.email}</strong>

                  <span>
                    {last?.message || "Нет сообщений"}
                  </span>
                </div>
              </button>
            );
          })
        )}
      </aside>

      {/* Окно переписки */}
      <section
        className={`moniq-admin-chat ${
          !selected ? "moniq-admin-mobile-hidden" : ""
        }`}
      >
        {!selected ? (
          <div className="moniq-admin-chat-empty">
            Выбери обращение слева, чтобы открыть
            переписку.
          </div>
        ) : (
          <>
            <header className="moniq-admin-chat-header">
              <button
                type="button"
                className="moniq-admin-back"
                onClick={() => setSelectedId(null)}
                aria-label="Вернуться к обращениям"
              >
                ←
              </button>

              <div className="moniq-admin-chat-user">
                <strong>{selected.email}</strong>
                <span>Чат поддержки</span>
              </div>

              <DeleteConversationButton
                userId={selected.userId}
              />
            </header>

            {/* Сообщения */}
            <div
              ref={messagesRef}
              className="moniq-admin-chat-messages"
            >
              {selected.items.map((message) => {
                const isAdmin =
                  message.role === "admin";

                return (
                  <div
                    key={message.id}
                    className={`moniq-admin-message-row ${
                      isAdmin
                        ? "moniq-admin-message-right"
                        : ""
                    }`}
                  >
                    <div
                      className={`moniq-admin-message ${
                        isAdmin
                          ? "moniq-admin-message-admin"
                          : ""
                      }`}
                    >
                      <div>{message.message}</div>

                      <small>
                        {new Date(
                          message.createdAt
                        ).toLocaleString("ru-RU")}
                      </small>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Ответ администратора */}
            <div className="moniq-admin-chat-reply">
              <AdminSupportReplyBox
                userId={selected.userId}
              />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
