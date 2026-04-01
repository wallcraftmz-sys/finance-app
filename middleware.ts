import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

const protectedRoutes = ["/dashboard", "/expenses", "/income", "/analytics", "/goals"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await verifySessionToken(token);
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/login", req.url));
    res.cookies.set("session", "", {
      path: "/",
      expires: new Date(0),
    });
    return res;
  }
}

export const config = {
  matcher: ["/dashboard/:path*", "/expenses/:path*", "/income/:path*", "/analytics/:path*", "/goals/:path*"],
};