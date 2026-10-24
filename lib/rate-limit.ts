
import { prisma } from "@/lib/prisma";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
};

export type DailyAiLimitResult = RateLimitResult & {
  reservationId: string | null;
};

export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<RateLimitResult> {
  if (
    !key ||
    !Number.isSafeInteger(limit) ||
    limit < 1 ||
    !Number.isSafeInteger(windowSeconds) ||
    windowSeconds < 1
  ) {
    throw new Error("Invalid rate limit configuration");
  }

  const rows = await prisma.$queryRaw<
    { count: number; expiresAt: Date }[]
  >`
    INSERT INTO "RateLimit" (
      "id", "count", "windowStart", "expiresAt"
    )
    VALUES (
      ${key},
      1,
      NOW(),
      NOW() + (${windowSeconds} * INTERVAL '1 second')
    )
    ON CONFLICT ("id")
    DO UPDATE SET
      "count" = CASE
        WHEN "RateLimit"."expiresAt" <= NOW()
          THEN 1
        ELSE "RateLimit"."count" + 1
      END,
      "windowStart" = CASE
        WHEN "RateLimit"."expiresAt" <= NOW()
          THEN NOW()
        ELSE "RateLimit"."windowStart"
      END,
      "expiresAt" = CASE
        WHEN "RateLimit"."expiresAt" <= NOW()
          THEN NOW() + (${windowSeconds} * INTERVAL '1 second')
        ELSE "RateLimit"."expiresAt"
      END
    RETURNING "count", "expiresAt"
  `;

  const record = rows[0];

  if (!record) {
    throw new Error("Rate limit update failed");
  }

  const allowed = record.count <= limit;

  return {
    allowed,
    remaining: Math.max(0, limit - record.count),
    retryAfter: allowed
      ? 0
      : Math.max(
          1,
          Math.ceil(
            (record.expiresAt.getTime() - Date.now()) / 1000
          )
        ),
  };
}

function getLatviaDate(): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Riga",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const get = (type: string) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

export async function checkDailyAiLimit(
  userId: string,
  plan: string
): Promise<DailyAiLimitResult> {
  if (!userId) {
    throw new Error("User ID is required");
  }

  const limit = plan === "PRO" ? 100 : 5;
  const today = getLatviaDate();
  const reservationId = `ai-daily:${userId}:${today}`;

  const rows = await prisma.$queryRaw<
    { count: number }[]
  >`
    INSERT INTO "RateLimit" (
      "id", "count", "windowStart", "expiresAt"
    )
    VALUES (
      ${reservationId},
      1,
      NOW(),
      NOW() + INTERVAL '48 hours'
    )
    ON CONFLICT ("id")
    DO UPDATE SET
      "count" = "RateLimit"."count" + 1
    WHERE "RateLimit"."count" < ${limit}
    RETURNING "count"
  `;

  if (rows.length === 0) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: 0,
      reservationId: null,
    };
  }

  return {
    allowed: true,
    remaining: Math.max(0, limit - rows[0].count),
    retryAfter: 0,
    reservationId,
  };
}

export async function refundDailyAiLimit(
  reservationId: string
): Promise<void> {
  if (!reservationId.startsWith("ai-daily:")) {
    throw new Error("Invalid AI reservation ID");
  }

  await prisma.$executeRaw`
    UPDATE "RateLimit"
    SET "count" = GREATEST(0, "count" - 1)
    WHERE "id" = ${reservationId}
      AND "count" > 0
  `;
}
