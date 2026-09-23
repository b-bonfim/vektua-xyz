import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_PATH, isValidAccessToken } from "@/lib/admin/access-policy";
import { revokeSupabaseSession } from "@/lib/admin/revoke-session";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return new NextResponse(null, { status: 403, headers: { "Cache-Control": "private, no-store" } });
  }

  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  // Local logout affects ONLY this Auth session, never other devices. The DB RPC
  // checks auth.sessions for every protected request, not the JWT signature alone.
  if (isValidAccessToken(token)) {
    let remotelyRevoked = false;
    try {
      const { url, publishableKey } = getPublicSupabaseEnv();
      remotelyRevoked = await revokeSupabaseSession(token, url, publishableKey);
    } catch { /* Fail closed locally; remote cleanup may require an operator. */ }
    if (!remotelyRevoked) {
      console.error("[SB-014] Auth logout cleanup unconfirmed; inspect auth.sessions.");
    }
  }

  const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    path: ADMIN_COOKIE_PATH, maxAge: 0,
  });
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Vary", "Cookie");
  return response;
}
