import fs from "node:fs";

const read = (path) => fs.readFileSync(path, "utf8");

const envSource = read("lib/supabase/env.ts");
const browserSource = read("lib/supabase/client.ts");
const serverSource = read("lib/supabase/server.ts");
const gitignore = read(".gitignore");

const fail = (message) => {
  throw new Error(`SB-005 contract failure: ${message}`);
};

for (const token of [
  "SUPABASE_SECRET",
  "SUPABASE_SERVICE_ROLE",
  "sb_secret_",
  "service_role",
]) {
  if (envSource.includes(token) || browserSource.includes(token)) {
    fail(`public Supabase client source references blocked token: ${token}`);
  }
}

for (const variable of [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
]) {
  if (!envSource.includes(variable)) {
    fail(`missing required public environment variable: ${variable}`);
  }
}

if (!envSource.includes('startsWith("sb_publishable_")')) {
  fail("publishable key format is not validated");
}

for (const setting of [
  "persistSession: false",
  "autoRefreshToken: false",
  "detectSessionInUrl: false",
]) {
  if (!serverSource.includes(setting)) {
    fail(`server client is missing auth setting: ${setting}`);
  }
}

if (!serverSource.includes("return createSupabaseClient(")) {
  fail("server client is not created per function call");
}

if (!gitignore.split(/\r?\n/).some((line) => line.trim() === ".env*")) {
  fail(".env* is not ignored by Git");
}

console.log("SB005_SUPABASE_CLIENT_CONTRACT_PASS");
