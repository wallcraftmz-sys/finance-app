import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
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

    if (!currentToken) {
      return NextResponse.json(
        { error: "Текущий сеанс не найден" },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);

    if (body?.allOthers === true) {
      const result = await prisma.session.deleteMany({
        where: {
          userId: user.id,
          token: { not: currentToken },
        },
      });

      return NextResponse.json({
        ok: true,
        revoked: result.count,
      });
    }

    if (typeof body?.sessionId !== "string" || !body.sessionId) {
      return NextResponse.json(
        { error: "Не указан сеанс" },
        { status: 400 }
      );
    }

    const result = await prisma.session.deleteMany({
      where: {
        id: body.sessionId,
        userId: user.id,
        token: { not: currentToken },
      },
    });

    if (result.count === 0) {
      return NextResponse.json(
        { error: "Сеанс не найден или является текущим" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      revoked: result.count,
    });
  } catch (error) {
    console.error("SESSION_REVOKE_ERROR", error);

    return NextResponse.json(
      { error: "Не удалось завершить сеанс" },
      { status: 500 }
    );
  }
}
