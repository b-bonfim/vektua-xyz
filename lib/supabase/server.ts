import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { getPublicSupabaseEnv } from "./env";

export function createServerSupabaseClient(): SupabaseClient<Database> {
  if (typeof window !== "undefined") {
    throw new Error(
      "[Supabase] createServerSupabaseClient must only run on the server.",
    );
  }

  const { url, publishableKey } = getPublicSupabaseEnv();

  return createSupabaseClient<Database>(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
}
