import { NextResponse } from "next/server";
import { auth, authEnabled } from "@/auth";

// Protect app routes when auth is enabled; otherwise pass everything through (dev).
export default auth((req) => {
  if (!authEnabled) return NextResponse.next();
  const isAuthRoute = req.nextUrl.pathname.startsWith("/api/auth") || req.nextUrl.pathname === "/signin";
  if (!req.auth && !isAuthRoute) {
    const url = new URL("/signin", req.nextUrl.origin);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
