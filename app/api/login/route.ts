import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";
import { createHash } from "node:crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");
    const clientIp = (
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  "unknown"
);

const ipHash = createHash("sha256")
  .update(clientIp)
  .digest("hex");

const emailHash = createHash("sha256")
  .update(email)
  .digest("hex");

const rateLimit = await checkRateLimit(
  `login:${ipHash}:${emailHash}`,
  5,
  900
);

if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: "Слишком много попыток входа. Попробуйте через 15 минут." },
    {
      status: 429,
      headers: {
        "Retry-After": String(rateLimit.retryAfter),
      },
    }
  );
}

    if (!email || !password) {
      return NextResponse.json(
        { error: "Введите email и пароль" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 404 }
      );
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return NextResponse.json(
        { error: "Неверный email или пароль" },
        { status: 401 }
      );
    }

    const token = crypto.randomUUID() + crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    const res = NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
      },
    });

    res.cookies.set("finance_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return res;
  } catch (error) {
    console.error("LOGIN_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка сервера при входе" },
      { status: 500 }
    );
  }
}
