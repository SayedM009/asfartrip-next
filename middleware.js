import { NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./app/_libs/auth";

const intlMiddleware = createMiddleware(routing);

export async function middleware(req) {
  const session = await auth();

  const protectedRoutes = ["/profile"];

  const isProtected = protectedRoutes.some((path) =>
    req.nextUrl.pathname.endsWith(path)
  );

  if (isProtected && !session) {
    const locale = req.nextUrl.pathname.startsWith("/ar") ? "ar" : "en";
    return NextResponse.redirect(new URL(`/${locale}/`, req.url));
  }

  return intlMiddleware(req);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
