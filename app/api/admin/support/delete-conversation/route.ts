import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    const adminEmail = String(process.env.ADMIN_EMAIL || "").trim().toLowerCase();

    if (!currentUser || currentUser.email.trim().toLowerCase() !== adminEmail) {
      return Response.json({ error: "Нет доступа" }, { status: 403 });
    }

    const body = await req.json();
    const userId = String(body.userId || "").trim();

    if (!userId) {
      return Response.json({ error: "userId обязателен" }, { status: 400 });
    }

    await prisma.supportMessage.deleteMany({
      where: { userId },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("DELETE_CONVERSATION_ERROR", error);
    return Response.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}