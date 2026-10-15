import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Не авторизован" },
        { status: 401 }
      );
    }

    const cookieStore = await cookies();
    const currentToken = cookieStore.get("finance_session")?.value;

    const sessions = await prisma.session.findMany({
      where: {
        userId: user.id,
        expiresAt: { gt: new Date() },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        token: true,
        createdAt: true,
        expiresAt: true,
      },
    });

    return NextResponse.json({
      sessions: sessions.map((session) => ({
        id: session.id,
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        current: session.token === currentToken,
      })),
    });
  } catch (error) {
    console.error("SESSIONS_GET_ERROR", error);

    return NextResponse.json(
      { error: "Не удалось получить сеансы" },
      { status: 500 }
    );
  }
}
