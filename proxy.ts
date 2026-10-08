import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_PATH, isAdminProtectedPath } from "@/lib/admin/access-policy";
import { canAccessAdmin } from "@/lib/admin/access";

/** Defense in depth: EVERY admin data endpoint and mutation must independently
 * authorize. The proxy alone is not a write authorization or a security gate.
 */
export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const protectedPath = isAdminProtectedPath(path);
  const allowed = !protectedPath || await canAccessAdmin(request.cookies.get(ADMIN_COOKIE)?.value);
  const response = allowed
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/admin/login", request.url), 303);

  if (protectedPath && !allowed && request.cookies.has(ADMIN_COOKIE)) {
    // Never keep a stale admin cookie through a role revocation/failed admission.
    response.cookies.set(ADMIN_COOKIE, "", {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: ADMIN_COOKIE_PATH, maxAge: 0,
    });
  }
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Vary", "Cookie");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

// Never intercept public storefront paths.
export const config = { matcher: ["/admin/:path*"] };
