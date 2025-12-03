// ============================================
// middleware.js - EDGE RUNTIME MIDDLEWARE
// ============================================
// Runs in Edge Runtime (Vercel Edge Network)
// Must be lightweight and fast
// Uses next-auth/middleware for auth checks

import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { authConfig } from "./app/_config/auth.config";

// Initialize next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Initialize NextAuth with Edge-safe config
const { auth } = NextAuth(authConfig);

// Export NextAuth middleware wrapper
export default auth((req) => {
  // req.auth contains session (from Edge-safe authConfig.callbacks.authorized)
  const isLoggedIn = !!req.auth?.user;
  const isProtected = req.nextUrl.pathname.includes('/profile');

  // Redirect logic
  if (isProtected && !isLoggedIn) {
    const locale = req.nextUrl.pathname.startsWith("/ar") ? "ar" : "en";
    return NextResponse.redirect(new URL(`/${locale}/`, req.url));
  }

  // Continue with next-intl routing
  return intlMiddleware(req);
});

export const config = {
  // Match all routes except API, static files, etc.
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*) "],
};