// middleware.js
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "@/app/[locale]/auth";
import { NextResponse } from "next/server";

// Create the internationalization middleware
const intlMiddleware = createIntlMiddleware(routing);

// Combined middleware function
async function middleware(req) {
  // 1. Handle internationalization first
  const intlResponse = intlMiddleware(req);

  // 2. Get authentication info
  const session = await auth();
  const isLoggedIn = !!session;

  // 3. Check route types
  const isApiAuthRoute = req.nextUrl.pathname.startsWith("/api/auth");
  const isApiRoute = req.nextUrl.pathname.startsWith("/api");

  // 4. Allow all API auth routes (login, logout, etc.)
  if (isApiAuthRoute) {
    return intlResponse;
  }

  // 5. Handle other API routes (optional protection)
  if (isApiRoute) {
    // Add API protection logic here if needed
    return intlResponse;
  }

  // 6. Protected routes logic
  const pathname = req.nextUrl.pathname;

  // Remove locale from pathname for route checking
  const pathnameWithoutLocale =
    pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "") || "/";

  // List of protected routes (customize as needed)
  const protectedRoutes = ["/dashboard", "/profile", "/bookings", "/admin"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathnameWithoutLocale.startsWith(route)
  );

  // 7. Redirect to login if accessing protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL("/login", req.url);
    // Preserve the intended destination
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  // 8. Redirect authenticated users away from auth pages
  const authPages = ["/login", "/register", "/signin"];
  const isAuthPage = authPages.some(
    (page) =>
      pathnameWithoutLocale === page ||
      pathnameWithoutLocale.startsWith(page + "/")
  );

  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 9. Return the intl response for all other cases
  return intlResponse;
}

// Export the combined middleware
export default middleware;

// Configure matcher to include both intl and auth routes
export const config = {
  matcher: [
    // Match internationalization routes
    "/((?!api|_next|_vercel|.*\\..*).*)",
    // Match API routes for auth
    "/api/(.*)",
  ],
};
// import createMiddleware from "next-intl/middleware";
// import { routing } from "./i18n/routing";

// export default createMiddleware(routing);

// export const config = {
//   matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
// };
