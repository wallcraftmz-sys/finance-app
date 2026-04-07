import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import AdminSupportReplyBox from "@/components/AdminSupportReplyBox";
import type { Prisma } from "@prisma/client";

type SupportMessageWithUser = Prisma.SupportMessageGetPayload<{
  include: { user: true };
}>;

export default async function AdminSupportPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.email !== process.env.ADMIN_EMAIL) {
    return <div style={{ padding: 20 }}>Доступ запрещён</div>;
  }

  await prisma.supportMessage.updateMany({
    where: {
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  const messages: SupportMessageWithUser[] = await prisma.supportMessage.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      user: true,
    },
  });

  const grouped = new Map<string, SupportMessageWithUser[]>();

  for (const message of messages) {
    const key = message.userId;

    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(message);
  }

  const conversations = Array.from(grouped.entries()).map(([userId, items]) => {
    const lastMessage = items[items.length - 1];

    return {
      userId,
      email: items[0].user.email,
      items,
      lastCreatedAt: lastMessage.createdAt,
    };
  });

  conversations.sort(
    (a, b) =>
      new Date(b.lastCreatedAt).getTime() - new Date(a.lastCreatedAt).getTime()
  );

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0f19",
        color: "#fff",
        padding: "32px 16px 120px",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <a
          href="/dashboard"
          style={{
            display: "inline-block",
            marginBottom: 20,
            padding: "10px 16px",
            borderRadius: 10,
            background: "#111827",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          ← Назад
        </a>

        <h1 style={{ fontSize: 32, marginBottom: 20 }}>Поддержка</h1>

        {conversations.length === 0 ? (
          <div
            style={{
              background: "rgba(17, 24, 39, 0.95)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              padding: 20,
            }}
          >
            Сообщений пока нет
          </div>
        ) : (
          <div style={{ display: "grid", gap: 18 }}>
            {conversations.map((conversation) => (
              <section
                key={conversation.userId}
                style={{
                  background: "rgba(17, 24, 39, 0.95)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 20,
                  padding: 18,
                  boxShadow: "0 14px 30px rgba(0,0,0,0.25)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 16,
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700 }}>
                      {conversation.email}
                    </div>
                    <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 4 }}>
                      userId: {conversation.userId}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                    <div style={{ color: "#9ca3af", fontSize: 14 }}>
                      {new Date(conversation.lastCreatedAt).toLocaleString()}
                    </div>

                    <form action={`/api/admin/support/delete-conversation?userId=${conversation.userId}`} method="post">
                      <button
                        type="submit"
                        style={{
                          border: "none",
                          borderRadius: 10,
                          background: "linear-gradient(135deg, #ef4444 0%, #f97316 100%)",
                          color: "#fff",
                          fontSize: 14,
                          fontWeight: 700,
                          padding: "10px 14px",
                          cursor: "pointer",
                        }}
                      >
                        Удалить диалог
                      </button>
                    </form>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  {conversation.items.map((m) => {
                    const isAdmin = m.role === "admin";

                    return (
                      <div
                        key={m.id}
                        style={{
                          display: "flex",
                          justifyContent: isAdmin ? "flex-end" : "flex-start",
                        }}
                      >
                        <div
                          style={{
                            maxWidth: "78%",
                            padding: "12px 14px",
                            borderRadius: 16,
                            background: isAdmin
                              ? "linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)"
                              : "#1f2937",
                            color: isAdmin ? "#111827" : "#fff",
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
                            {isAdmin ? "Ты (админ)" : "Пользователь"}
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
                  })}
                </div>

                <AdminSupportReplyBox userId={conversation.userId} />
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}