import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Add security headers to all responses
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Log page views for monitoring (lightweight — no DB call in middleware)
  if (!pathname.startsWith("/api/") && !pathname.startsWith("/_next/") && !pathname.includes(".")) {
    response.headers.set("X-Page-Path", pathname);
  }

  return response;
}

export const config = {
  matcher: [
    // Match all paths except static files and API internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
