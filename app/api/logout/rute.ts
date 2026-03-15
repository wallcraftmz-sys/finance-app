import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("finance_session")?.value;

    if (token) {
      await prisma.session.deleteMany({
        where: { token },
      });
    }

    const res = NextResponse.json({ ok: true });

    res.cookies.set("finance_session", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return res;
  } catch (error) {
    console.error("LOGOUT_ERROR", error);
    return NextResponse.json(
      { error: "Ошибка сервера при выходе" },
      { status: 500 }
    );
  }
}