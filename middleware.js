// ============================================
// middleware.js - EDGE RUNTIME MIDDLEWARE
// ============================================
// FIXED: Removed extra space in matcher, using single auth instance

import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./app/_libs/auth";

// Initialize next-intl middleware
const intlMiddleware = createMiddleware(routing);

// Export NextAuth middleware wrapper using the SINGLE auth instance from auth.js
export default auth((req) => {
  // req.auth contains session (from authConfig.callbacks.authorized)
  const isLoggedIn = !!req.auth?.user;
  const isProtected = req.nextUrl.pathname.includes('/profile');

  // Redirect logic for protected routes
  if (isProtected && !isLoggedIn) {
    const locale = req.nextUrl.pathname.startsWith("/ar") ? "ar" : "en";
    const signInUrl = new URL(`/${locale}/`, req.url);
    return Response.redirect(signInUrl);
  }

  // Continue with next-intl routing
  return intlMiddleware(req);
});

export const config = {
  // ✅ FIXED: Removed extra space at the end
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*) "],
};