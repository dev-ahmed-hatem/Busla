import createMiddleware from "next-intl/middleware";

import { routing } from "./src/i18n/routing";

export default createMiddleware(routing);

export const config = {
  matcher: [
    // The locale-less root, so `/` redirects to `/<defaultLocale>`.
    "/",
    // Locale-prefixed paths.
    "/(ar|en)/:path*",
    // Everything else except API, Next internals, and static files.
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
