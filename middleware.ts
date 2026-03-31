import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PROTECTED_PATHS = [
  "/dashboard",
  "/analytics",
  "/goals",
  "/income",
  "/expenses",
  "/assistant",
];

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const token = req.cookies.get("finance_session")?.value;
  const maintenanceMode = process.env.MAINTENANCE_MODE === "true";

  const isProtected = PROTECTED_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  const allowedDuringMaintenance =
    pathname === "/maintenance" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api/health") ||
    pathname === "/favicon.ico" ||
    pathname === "/manifest.json" ||
    pathname.startsWith("/icon-") ||
    pathname === "/icon.png";

  if (maintenanceMode && !allowedDuringMaintenance) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  if (!maintenanceMode && pathname === "/maintenance") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api).*)"],
};