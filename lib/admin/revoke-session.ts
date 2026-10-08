/* SB-014: terminate only the freshly created/current Auth session.
 * The caller must never persist a rejected token, and must treat false as
 * cleanup NOT confirmed rather than as a successful remote revocation.
 */
export async function revokeSupabaseSession(
  accessToken: unknown,
  projectUrl: string,
  publishableKey: string,
  transport: typeof fetch = fetch,
): Promise<boolean> {
  if (typeof accessToken !== "string" || accessToken.length > 4096 ||
      !/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(accessToken)) {
    return false;
  }
  try {
    const endpoint = new URL("/auth/v1/logout?scope=local", projectUrl);
    const response = await transport(endpoint.toString(), {
      method: "POST",
      cache: "no-store",
      headers: { apikey: publishableKey, Authorization: `Bearer ${accessToken}` },
    });
    return response.ok;
  } catch {
    return false;
  }
}
