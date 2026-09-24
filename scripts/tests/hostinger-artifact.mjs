import { existsSync, readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const packageJson = JSON.parse(readFileSync(resolve("package.json"), "utf8"));
if (packageJson.packageManager !== "npm@10.9.2") {
  console.error("[hostinger] npm pin changed: reconcile installer and lockfile before deploying.");
  process.exit(1);
}

const assertNonEmptyFile = (path, message) => {
  if (!existsSync(path) || !statSync(path).isFile() || statSync(path).size === 0) {
    console.error(message);
    process.exit(1);
  }
};

const rootEntry = resolve("server.js");
assertNonEmptyFile(
  rootEntry,
  "[hostinger] Missing root server.js launcher required for repository-root startup.",
);

const standaloneEntry = resolve("dist/standalone/server.js");
assertNonEmptyFile(
  standaloneEntry,
  "[hostinger] Missing dist/standalone/server.js; a Worker build is not a Hostinger Node build.",
);

const standalonePackagePath = resolve("dist/standalone/package.json");
assertNonEmptyFile(
  standalonePackagePath,
  "[hostinger] Missing dist/standalone/package.json in runtime artifact.",
);

const standalonePackage = JSON.parse(readFileSync(standalonePackagePath, "utf8"));
if (standalonePackage.scripts?.start !== "node server.js") {
  console.error("[hostinger] Standalone package start script is not configured as node server.js.");
  process.exit(1);
}

console.log(
  "[hostinger] Runtime compatibility verified: root launcher, standalone entry, and standalone npm start are ready.",
);
console.log("[hostinger] Runtime and HTTP/browser smoke remain required.");
