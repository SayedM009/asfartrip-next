import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./app/_libs/auth";

const intlMiddleware = createMiddleware(routing);

export default auth((req) => {
  // Session is available as req.auth
  const session = req.auth;

  const protectedRoutes = ["/profile"];
  const isProtected = protectedRoutes.some((path) =>
    req.nextUrl.pathname.endsWith(path)
  );

  if (isProtected && !session) {
    const locale = req.nextUrl.pathname.startsWith("/ar") ? "ar" : "en";
    return Response.redirect(new URL(`/${locale}/`, req.url));
  }

  return intlMiddleware(req);
});

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*) "],
};
