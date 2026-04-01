import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { SignJWT, jwtVerify } from "jose";

function getSecret() {
  const value = process.env.AUTH_SECRET;

  if (!value) {
    throw new Error("AUTH_SECRET is missing");
  }

  return new TextEncoder().encode(value);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("finance_session")?.value;

  if (!token) {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: {
      user: true,
    },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt < new Date()) {
    return null;
  }

  return session.user;
}

export type SessionPayload = {
  email: string;
};

export async function createSessionToken(payload: SessionPayload) {
  const secret = getSecret();

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const secret = getSecret();
  const { payload } = await jwtVerify(token, secret);
  return payload as SessionPayload;
}
