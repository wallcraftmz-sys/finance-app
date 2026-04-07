import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json(
        { error: "Нужно войти в аккаунт" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const message = String(body.message || "").trim();

    if (!message) {
      return Response.json(
        { error: "Сообщение обязательно" },
        { status: 400 }
      );
    }

    const data = await prisma.supportMessage.create({
      data: {
        userId: user.id,
        message,
        role: "user",
      },
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("SUPPORT_POST_ERROR", error);
    return Response.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
      return Response.json(
        { error: "Нет доступа" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const userId = String(body.userId || "").trim();
    const message = String(body.message || "").trim();

    if (!userId || !message) {
      return Response.json(
        { error: "userId и message обязательны" },
        { status: 400 }
      );
    }

    const data = await prisma.supportMessage.create({
      data: {
        userId,
        message,
        role: "admin",
        isRead: true,
      },
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error("SUPPORT_PUT_ERROR", error);
    return Response.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}