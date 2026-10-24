
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import AdminSupportMessenger from "@/components/AdminSupportMessenger";

export default async function AdminSupportPage() {
  const currentUser = await getCurrentUser();

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  if (
    !currentUser ||
    !adminEmail ||
    currentUser.email.trim().toLowerCase() !== adminEmail
  ) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "var(--moniq-bg)",
          color: "var(--moniq-text)",
          padding: "24px",
        }}
      >
        Доступ запрещён
      </main>
    );
  }

  const messages = await prisma.supportMessage.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      user: {
        select: {
          email: true,
        },
      },
    },
  });

  const grouped = new Map<
    string,
    {
      userId: string;
      email: string;
      items: {
        id: string;
        role: string;
        message: string;
        createdAt: string;
      }[];
      lastCreatedAt: string;
    }
  >();

  for (const message of messages) {
    if (!grouped.has(message.userId)) {
      grouped.set(message.userId, {
        userId: message.userId,
        email: message.user.email,
        items: [],
        lastCreatedAt: message.createdAt.toISOString(),
      });
    }

    const conversation = grouped.get(message.userId)!;

    conversation.items.push({
      id: message.id,
      role: message.role,
      message: message.message,
      createdAt: message.createdAt.toISOString(),
    });

    conversation.lastCreatedAt =
      message.createdAt.toISOString();
  }

  const conversations = Array.from(grouped.values()).sort(
    (a, b) =>
      new Date(b.lastCreatedAt).getTime() -
      new Date(a.lastCreatedAt).getTime()
  );

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "var(--moniq-bg)",
        color: "var(--moniq-text)",
        padding: "16px 14px 30px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "12px",
                color: "var(--moniq-muted)",
                marginBottom: "4px",
              }}
            >
              moniq
            </div>

            <h1
              style={{
                fontSize: "24px",
                margin: 0,
              }}
            >
              Поддержка
            </h1>
          </div>

          <a
            href="/dashboard"
            style={{
              padding: "10px 12px",
              borderRadius: "12px",
              background: "var(--moniq-card)",
              border: "1px solid var(--moniq-border)",
              color: "var(--moniq-text)",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            ← Назад
          </a>
        </header>

        <AdminSupportMessenger
          conversations={conversations}
        />
      </div>
    </main>
  );
}
