import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return Response.json([], { status: 200 });
    }

    const messages = await prisma.supportMessage.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "asc" },
    });

    return Response.json(messages);
  } catch (error) {
    console.error("SUPPORT_GET_ERROR", error);
    return Response.json([], { status: 200 });
  }
}