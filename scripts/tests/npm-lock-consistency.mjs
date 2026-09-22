// Preflight check. Does not replace npm ci's full integrity and dependency checks.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync('package.json', 'utf8'));
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const root = lock.packages?.[''];

assert.equal(manifest.packageManager, 'npm@10.9.2', 'Expected approved npm migration version');
assert.equal(lock.lockfileVersion, 3, 'Expected npm v10 lockfile format 3');
assert.ok(root, 'package-lock.json is missing its root package');
assert.equal(root.name, manifest.name, 'Lockfile root name does not match package.json');
assert.equal(root.version, manifest.version, 'Lockfile root version does not match package.json');
for (const field of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
  assert.deepEqual(root[field] ?? {}, manifest[field] ?? {}, `Lockfile ${field} differs from package.json; regenerate the lockfile`);
}
assert.deepEqual(root.engines ?? {}, manifest.engines ?? {}, 'Lockfile engines differ from package.json');
console.log('NPM_LOCK_ROOT_PASS; run npm ci to validate the complete dependency graph and integrity.');
