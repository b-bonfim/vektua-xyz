"use client";

import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { getPublicSupabaseEnv } from "./env";

let browserClient: SupabaseClient<Database> | undefined;

export function createBrowserSupabaseClient(): SupabaseClient<Database> {
  if (!browserClient) {
    const { url, publishableKey } = getPublicSupabaseEnv();
    browserClient = createSupabaseClient<Database>(url, publishableKey);
  }

  return browserClient;
}
