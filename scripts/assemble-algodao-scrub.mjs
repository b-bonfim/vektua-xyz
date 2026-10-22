/**
 * Assemble Algodão Pesado's approved scroll film before Vinext builds.
 * Binary chunks are tracked in Git; the generated MP4 is intentionally not.
 * This avoids requiring GitHub Actions, Git LFS or additional deployment services.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const chunksFolder = join(projectRoot, 'media-src', 'algodao-pesado');
const target = join(projectRoot, 'public', 'images', 'campaigns', 'algodao-pesado', 'audience-tribute-scrub.mp4');
const expectedHash = 'b951df7d2becdb03cf1c9aff7e6d0b7f99942745011bf6182221122ef4dfb208';
const expectedSize = 3_187_285;
const chunkNames = Array.from({ length: 10 }, (_, index) => 'scrub-' + String(index).padStart(2, '0') + '.part');
const sha256 = (buffer) => createHash('sha256').update(buffer).digest('hex');

async function main() {
  const chunks = await Promise.all(chunkNames.map((name) => readFile(join(chunksFolder, name))));
  const combined = Buffer.concat(chunks);
  const actualHash = sha256(combined);
  if (combined.length !== expectedSize || actualHash !== expectedHash) {
    throw new Error(
      'Algodão Pesado scroll film did not pass integrity check. ' +
      'Expected ' + expectedSize + ' bytes / ' + expectedHash +
      ', received ' + combined.length + ' bytes / ' + actualHash
    );
  }
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, combined);
  console.log('[algodao-scrub] MP4 assembled & verified: ' + combined.length + ' bytes');
}

await main();
