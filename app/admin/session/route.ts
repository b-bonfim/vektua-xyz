import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { ADMIN_COOKIE, ADMIN_COOKIE_PATH, sessionCookieLifetime } from "@/lib/admin/access-policy";
import { canAccessAdmin } from "@/lib/admin/access";

export const dynamic = "force-dynamic";

function noStore(response: NextResponse) {
  response.headers.set("Cache-Control", "private, no-store, max-age=0");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Vary", "Cookie");
  response.headers.set("X-Robots-Tag", "noindex, nofollow, noarchive");
  return response;
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) {
    return noStore(new NextResponse(null, {status:403}));
  }
  const form = await request.formData();
  const email = form.get("email");
  const password = form.get("password");
  const deny = () => noStore(NextResponse.redirect(new URL("/admin/login?erro=acesso",request.url),303));
  if (typeof email !== "string" || email.length > 254 || typeof password !== "string" || password.length < 1 || password.length > 1024) return deny();
  try {
    const auth = createServerSupabaseClient();
    const {data,error} = await auth.auth.signInWithPassword({email,password});
    const token = data.session?.access_token;
    const expires = sessionCookieLifetime(data.session?.expires_at, Math.floor(Date.now()/1000));
    if (error || !token || expires <= 0 || !(await canAccessAdmin(token))) return deny();
    const response = noStore(NextResponse.redirect(new URL("/admin",request.url),303));
    // A short-lived HttpOnly admin-only cookie; NO refresh token, no localStorage,
    // no session data on public storefront. Reauthentication on expiry is intentional.
    response.cookies.set(ADMIN_COOKIE,token,{
      httpOnly:true,secure:process.env.NODE_ENV === "production",sameSite:"strict",
      path:ADMIN_COOKIE_PATH,maxAge:expires,
    });
    return response;
  } catch {
    return deny();
  }
}
