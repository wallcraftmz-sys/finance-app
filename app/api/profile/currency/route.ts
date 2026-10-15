import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ALLOWED_CURRENCIES = [
  "EUR",
  "USD",
  "GBP",
  "PLN",
  "SEK",
  "CHF",
] as const;

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Необходимо войти в аккаунт" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const currency = body.currency;

    if (
      typeof currency !== "string" ||
      !ALLOWED_CURRENCIES.includes(
        currency as (typeof ALLOWED_CURRENCIES)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Неподдерживаемая валюта" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { currency },
      select: { currency: true },
    });

    return NextResponse.json({
      ok: true,
      currency: updated.currency,
    });
  } catch (error) {
    console.error("CURRENCY_UPDATE_ERROR", error);

    return NextResponse.json(
      { error: "Не удалось сохранить валюту" },
      { status: 500 }
    );
  }
}
