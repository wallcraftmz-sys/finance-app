import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json({ count: 0 });
    }

    const count = await prisma.supportMessage.count({
      where: {
        userId: user.id,
        role: "admin",
        isRead: false,
      },
    });

    return Response.json({ count });
  } catch (error) {
    return Response.json({ count: 0 });
  }
}