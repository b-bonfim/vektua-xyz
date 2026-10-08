import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { ADMIN_COOKIE, ADMIN_COOKIE_PATH, sessionCookieLifetime } from "@/lib/admin/access-policy";
import { canAccessAdmin } from "@/lib/admin/access";
import { revokeSupabaseSession } from "@/lib/admin/revoke-session";

export const dynamic = "force-dynamic";

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Vary", "Cookie");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

function deny(request: NextRequest) {
  const response = noStore(NextResponse.redirect(new URL("/admin/login?erro=acesso", request.url), 303));
  // A denied attempt must not leave an earlier administrative browser cookie in place.
  response.cookies.set(ADMIN_COOKIE, "", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
    path: ADMIN_COOKIE_PATH, maxAge: 0,
  });
  return response;
}

async function revokeRejectedSession(accessToken: string | undefined) {
  if (!accessToken) return;
  let revoked = false;
  try {
    const { url, publishableKey } = getPublicSupabaseEnv();
    revoked = await revokeSupabaseSession(accessToken, url, publishableKey);
  } catch { /* Never expose Auth errors or tokens to the browser. */ }
  if (!revoked) {
    // No token, email, user ID or password in logs. The refused login stays denied,
    // but cleanup requires operator verification if the Auth service did not confirm it.
    console.error("[SB-014] Rejected Auth session cleanup unconfirmed; inspect auth.sessions.");
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return noStore(new NextResponse(null, { status: 403 }));
  }
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  if (typeof email !== "string" || email.length > 254 || typeof password !== "string" || password.length < 1 || password.length > 1024) return deny(request);

  let issuedToken: string | undefined;
  try {
    const auth = createServerSupabaseClient();
    const { data, error } = await auth.auth.signInWithPassword({ email, password });
    issuedToken = data.session?.access_token;
    const expires = sessionCookieLifetime(data.session?.expires_at, Math.floor(Date.now() / 1000));
    if (error || !issuedToken || expires <= 0 || !(await canAccessAdmin(issuedToken))) {
      await revokeRejectedSession(issuedToken);
      return deny(request);
    }
    const response = noStore(NextResponse.redirect(new URL("/admin", request.url), 303));
    // No refresh token, no localStorage and no session on public storefront.
    response.cookies.set(ADMIN_COOKIE, issuedToken, {
      httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict",
      path: ADMIN_COOKIE_PATH, maxAge: expires,
    });
    return response;
  } catch {
    await revokeRejectedSession(issuedToken);
    return deny(request);
  }
}
