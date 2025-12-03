import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { auth } from "./app/_libs/auth";

export default auth((req) => {
  return createMiddleware(routing)(req);
});

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)"
  ],
};
