import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.email !== process.env.ADMIN_EMAIL) {
      return Response.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const count = await prisma.supportMessage.count({
      where: {
        isRead: false,
      },
    });

    return Response.json({ count });
  } catch (error) {
    console.error("ADMIN_SUPPORT_UNREAD_COUNT_ERROR", error);
    return Response.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}