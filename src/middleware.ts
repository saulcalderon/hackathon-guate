import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /_next (Next.js internals)
  // - /static (static files, if any)
  // - /.*\\..* (files with extensions, like favicon.ico, logo.svg, etc.)
  matcher: ["/((?!api|_next|static|.*\\..*).*)"],
};
