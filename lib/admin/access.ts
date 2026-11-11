import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPublicSupabaseEnv } from "@/lib/supabase/env";
import { isValidAccessToken } from "./access-policy";

/** Every request: validate identity with Auth AND authorize via a fresh, fail-closed
 * database lookup. The RPC additionally confirms that the Auth session still exists.
 * Never use user_metadata, a cookie value alone, or UI visibility as authorization.
 */
export async function canAccessAdmin(accessToken: unknown): Promise<boolean> {
  if (!isValidAccessToken(accessToken)) return false;
  try {
    const client = createServerSupabaseClient();
    const { data: { user }, error } = await client.auth.getUser(accessToken);
    if (error || !user) return false;

    const { url, publishableKey } = getPublicSupabaseEnv();
    const response = await fetch(`${url}/rest/v1/rpc/can_access_admin`, {
      method: "POST",
      cache: "no-store",
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    if (!response.ok) return false;
    return (await response.json()) === true;
  } catch {
    // DB/Auth/network outages MUST deny access; never fall back to client metadata.
    return false;
  }
}
