import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { readExecutionProfile } from "./execution-profile.mjs";

const [command, ...args] = process.argv.slice(2);
if (!["dev", "build", "build-hostinger"].includes(command)) {
  throw new Error("Expected dev, build, or build-hostinger.");
}
const hostingerBuild = command === "build-hostinger";
const frameworkCommand = hostingerBuild ? "build" : command;
const managedLinux = readExecutionProfile() === "managed-linux";

if (hostingerBuild) {
  // The default build remains Cloudflare-compatible. Only the explicit
  // Hostinger command enables Vinext's self-hosted Node.js output.
  process.env.VEKTUA_DEPLOY_TARGET = "hostinger";
}

if (managedLinux && command === "build") {
  const result = spawnSync("bash", [
    fileURLToPath(new URL("./build-verified.sh", import.meta.url)), ...args,
  ], { stdio: "inherit" });
  if (result.error) throw result.error;
  process.exit(result.status ?? 1);
}

// Import in this process so the preview owner retains its PID and signals.
const cli = new URL(managedLinux && !hostingerBuild
  ? "../node_modules/vite/bin/vite.js"
  : "../node_modules/vinext/dist/cli.js", import.meta.url);
process.argv = [process.execPath, fileURLToPath(cli), frameworkCommand,
  ...(!managedLinux && frameworkCommand === "dev" ? ["--port", "5173"] : []), ...args];
await import(cli.href);
