/** SB-014: route boundary helpers. Authorization itself always runs server-side. */
export const ADMIN_COOKIE = "vektua_admin_access";
export const ADMIN_COOKIE_PATH = "/admin";
export const ADMIN_COOKIE_MAX_AGE_SECONDS = 3600;

export function isAdminProtectedPath(pathname: string): boolean {
  const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
  if (!isAdmin) return false;
  return !["/admin/login", "/admin/session", "/admin/logout"].includes(pathname);
}

export function isValidAccessToken(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 4096
    && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
}

export function sessionCookieLifetime(expiresAt: number | undefined, nowSeconds: number): number {
  if (!Number.isFinite(expiresAt) || !expiresAt) return 0;
  return Math.max(0, Math.min(ADMIN_COOKIE_MAX_AGE_SECONDS, Math.floor(expiresAt - nowSeconds)));
}
