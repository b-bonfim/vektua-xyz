import { rmSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const buildScript = process.env.SB026_BUILD_SCRIPT || 'build:hostinger';
const outputs = ['.next', '.vinext', 'dist'];

function clean() {
  for (const output of outputs) {
    rmSync(output, { recursive: true, force: true });
  }
}

function requireSupabaseEnv() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY',
  ];
  const missing = required.filter((name) => !process.env[name]?.trim());
  if (missing.length > 0) {
    throw new Error(
      `Supabase build requires environment variables: ${missing.join(', ')}`,
    );
  }
}

for (const mode of ['static', 'supabase']) {
  if (mode === 'supabase') {
    requireSupabaseEnv();
  }

  clean();
  console.log(`\n=== SB-026 build: CATALOG_SOURCE=${mode} / npm run ${buildScript} ===`);

  const result = spawnSync(
    npmCommand,
    ['run', buildScript],
    {
      env: {
        ...process.env,
        CATALOG_SOURCE: mode,
      },
      stdio: 'inherit',
    },
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(
      `Build failed for CATALOG_SOURCE=${mode} with status ${result.status}`,
    );
  }

  console.log(`SB026_BUILD_PASS source=${mode}`);
}

console.log('\nSB026_BUILD_MATRIX_PASS');
