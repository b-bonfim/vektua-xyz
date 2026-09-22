import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const packageJson = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
if (packageJson.packageManager !== "npm@10.9.2") {
  console.error("[hostinger] npm pin changed: reconcile installer and lockfile before deploying.");
  process.exit(1);
}

const entry = resolve("dist/standalone/server.js");
if (!existsSync(entry) || !statSync(entry).isFile() || statSync(entry).size === 0) {
  console.error("[hostinger] Missing dist/standalone/server.js; a Worker build is not a Hostinger Node build.");
  process.exit(1);
}

console.log("[hostinger] Standalone Node entry exists. Runtime and HTTP/browser smoke remain required.");
