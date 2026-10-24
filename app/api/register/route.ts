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

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email и пароль обязательны" },
        { status: 400 }
      );
    }
    const clientIp =
  req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
  "unknown";

const ipHash = createHash("sha256")
  .update(clientIp)
  .digest("hex");

const rateLimit = await checkRateLimit(
  `register:${ipHash}`,
  5,
  900
);

if (!rateLimit.allowed) {
  return NextResponse.json(
    { error: "Слишком много попыток регистрации. Попробуйте позже." },
    {
      status: 429,
      headers: {
        "Retry-After": String(rateLimit.retryAfter),
      },
    }
  );
}
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Пароль должен быть минимум 8 символов" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ ok: true, user });
  } catch (error) {
    console.error("REGISTER_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка сервера при регистрации" },
      { status: 500 }
    );
  }
}