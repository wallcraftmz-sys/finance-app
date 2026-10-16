import { prisma } from "@/lib/prisma";

type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfter: number;
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
    INSERT INTO "RateLimit" ("id", "count", "windowStart", "expiresAt")
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
