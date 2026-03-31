import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";
  const pathname = req.nextUrl.pathname;

  const allowed =
    pathname === "/maintenance" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/health") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname.startsWith("/icon-");

  if (maintenanceMode && !allowed) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  if (!maintenanceMode && pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/auth).*)"],
};