import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, isAdminProtectedPath } from "@/lib/admin/access-policy";
import { canAccessAdmin } from "@/lib/admin/access";

/** Defense in depth: admin endpoints MUST also authorize on the server before
 * returning private data or mutating state. Proxy alone is not an authorization API.
 */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const response = !isAdminProtectedPath(path)
    ? NextResponse.next()
    : (await canAccessAdmin(request.cookies.get(ADMIN_COOKIE)?.value))
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/admin/login", request.url), 303);

  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Vary", "Cookie");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

// Do not touch storefront requests: no public session requirement or cookie writes.
export const config = { matcher: ["/admin/:path*"] };
