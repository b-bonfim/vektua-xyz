import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vinext emits dist/standalone/server.js for self-hosted Node when enabled.
  // Keep the original Cloudflare build unchanged for all other environments.
  ...(process.env.VEKTUA_DEPLOY_TARGET === "hostinger"
    ? { output: "standalone" as const }
    : {}),
};

export default nextConfig;
