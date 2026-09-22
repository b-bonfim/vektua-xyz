export type PublicSupabaseEnv = {
  url: string;
  publishableKey: string;
};

function requireValue(name: string, value: string | undefined): string {
  const normalized = value?.trim();

  if (!normalized) {
    throw new Error(`[Supabase] Missing required environment variable: ${name}`);
  }

  return normalized;
}

function requireHttpsUrl(name: string, value: string): string {
  let parsed: URL;

  try {
    parsed = new URL(value);
  } catch {
    throw new Error(`[Supabase] ${name} must be a valid URL.`);
  }

  if (parsed.protocol !== "https:") {
    throw new Error(`[Supabase] ${name} must use HTTPS.`);
  }

  return value;
}

export function getPublicSupabaseEnv(): PublicSupabaseEnv {
  const url = requireHttpsUrl(
    "NEXT_PUBLIC_SUPABASE_URL",
    requireValue(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL,
    ),
  );
  const publishableKey = requireValue(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );

  if (!publishableKey.startsWith("sb_publishable_")) {
    throw new Error(
      "[Supabase] NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must use the sb_publishable_ key format.",
    );
  }

  return { url, publishableKey };
}
