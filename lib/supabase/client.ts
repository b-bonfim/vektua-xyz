"use client";

import {
  createClient as createSupabaseClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import { getPublicSupabaseEnv } from "./env";

let browserClient: SupabaseClient | undefined;

export function createBrowserSupabaseClient(): SupabaseClient {
  if (!browserClient) {
    const { url, publishableKey } = getPublicSupabaseEnv();
    browserClient = createSupabaseClient(url, publishableKey);
  }

  return browserClient;
}
