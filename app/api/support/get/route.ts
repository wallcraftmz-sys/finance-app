import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const messages = await prisma.supportMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    return Response.json(messages, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("SUPPORT_GET_ERROR", error);

    return Response.json(
      { error: "Ошибка загрузки сообщений" },
      { status: 500 }
    );
  }
}