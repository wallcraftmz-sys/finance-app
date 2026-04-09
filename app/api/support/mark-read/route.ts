import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ ok: false }, { status: 401 });
    }

    await prisma.supportMessage.updateMany({
      where: {
        userId: user.id,
        role: "admin",
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("SUPPORT_MARK_READ_ERROR", error);
    return Response.json({ ok: false }, { status: 500 });
  }
}