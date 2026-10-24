
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

    if (
      !currentUser ||
      !adminEmail ||
      currentUser.email.trim().toLowerCase() !== adminEmail
    ) {
      return Response.json(
        { error: "Доступ запрещён" },
        { status: 403 }
      );
    }

    const messages = await prisma.supportMessage.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        user: {
          select: { email: true },
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

      conversation.lastCreatedAt = message.createdAt.toISOString();
    }

    const conversations = Array.from(grouped.values()).sort(
      (a, b) =>
        new Date(b.lastCreatedAt).getTime() -
        new Date(a.lastCreatedAt).getTime()
    );

    return Response.json(conversations, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("ADMIN_SUPPORT_CONVERSATIONS_ERROR", error);

    return Response.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}
