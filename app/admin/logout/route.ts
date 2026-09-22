import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_PATH, isValidAccessToken } from "@/lib/admin/access-policy";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return new NextResponse(null, {status:403,headers:{"Cache-Control":"private, no-store"}});
  }
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  // Revoke the current refresh session where possible. Regardless of network
  // result, discard the browser's admin cookie so this browser cannot re-enter.
  if (isValidAccessToken(token)) {
    try {
      const {url,publishableKey} = getPublicSupabaseEnv();
      await fetch(`${url}/auth/v1/logout?scope=local`,{
        method:"POST",cache:"no-store",
        headers:{apikey:publishableKey,Authorization:`Bearer ${token}`},
      });
    } catch { /* fail closed in browser; review auth.sessions for remote revocation */ }
  }
  const response = NextResponse.redirect(new URL("/admin/login",request.url),303);
  response.cookies.set(ADMIN_COOKIE,"",{
    httpOnly:true,secure:process.env.NODE_ENV === "production",sameSite:"strict",
    path:ADMIN_COOKIE_PATH,maxAge:0,
  });
  response.headers.set("Cache-Control","private, no-store, max-age=0");
  response.headers.set("Pragma","no-cache");
  response.headers.set("Vary","Cookie");
  return response;
}
