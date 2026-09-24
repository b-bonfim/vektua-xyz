import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const packagePath = resolve("dist/standalone/package.json");

if (!existsSync(packagePath)) {
  console.error("[hostinger] Missing dist/standalone/package.json after Vinext build.");
  process.exit(1);
}

const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));

packageJson.private = true;
packageJson.type = packageJson.type ?? "module";
packageJson.engines = {
  ...(packageJson.engines ?? {}),
  node: ">=22.13.0",
};
packageJson.scripts = {
  ...(packageJson.scripts ?? {}),
  start: "node server.js",
};

writeFileSync(packagePath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf8");

console.log("[hostinger] Standalone runtime package prepared with start: node server.js.");
