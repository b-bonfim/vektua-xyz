/** Focused read-only smoke test for Vektua XYZ /sobre and its eight byte-for-byte video segments.
 * BASE_URL=https://vektua.xyz/ node scripts/tests/sobre-route-smoke.mjs
 * Does not trigger GitHub Actions, WhatsApp messages, purchases or deployment.
 */
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

const rawBase=process.env.BASE_URL;
assert.ok(rawBase,'BASE_URL is required');
const base=new URL(rawBase);
assert.ok(['http:','https:'].includes(base.protocol));
assert.equal(base.pathname,'/');
assert.equal(base.username+base.password,'');
const knownSha='b8408cb1808df1256cb0daaad72718158072e17ba719b950471caf79777b25de';
const get=async path=>{
  const response=await fetch(new URL(path.slice(1),base),{signal:AbortSignal.timeout(30000)});
  assert.equal(response.status,200,`${path} must return HTTP 200`);
  return response;
};
const html=await (await get('/sobre')).text();
for(const expected of ['Objetos com personalidade','Do achado','Blind Rats','A Padoca','Algodão Pesado','Feitos para Você']){
  assert.ok(html.includes(expected),`/sobre is missing ${expected}`);
}
console.log('PASS /sobre content and manifesto');
const poster=Buffer.from(await (await get('/images/brand/cosmogonia/poster-final.jpg')).arrayBuffer());
assert.ok(poster.length>50000,'poster truncated');
assert.equal(poster[0],255);
assert.equal(poster[1],216);
console.log(`PASS poster ${poster.length} bytes`);
const binary=[];
for(let i=0;i<8;i++){
  const name=`/images/brand/cosmogonia/segment-${String(i).padStart(2,'0')}.bin`;
  const bytes=Buffer.from(await (await get(name)).arrayBuffer());
  const expectedBytes=i===7?839128:900000;
  assert.equal(bytes.length,expectedBytes,`${name} byte length`);
  binary.push(bytes);
  console.log(`PASS ${name} ${bytes.length} bytes`);
}
const master=Buffer.concat(binary);
assert.equal(master.length,7139128);
assert.equal(master.subarray(4,8).toString('ascii'),'ftyp');
assert.equal(createHash('sha256').update(master).digest('hex'),knownSha,'reconstructed MP4 must be exactly the approved master');
console.log('PASS 20-second scrub master reconstructed exactly from eight segments');
