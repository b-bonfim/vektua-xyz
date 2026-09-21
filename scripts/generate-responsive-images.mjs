// Deterministic static WebP derivatives with provenance; original images are untouched.
// Sharp is installed isolated/pinned on CI, not added to the application lockfile.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createHash } from 'node:crypto';
import { readdirSync, readFileSync, writeFileSync, mkdirSync, statSync, rmSync } from 'node:fs';
import { basename, join } from 'node:path';
const require=createRequire(import.meta.url);
assert.ok(process.env.SHARP_MODULE,'SHARP_MODULE must be the path to isolated sharp');
const sharp=require(process.env.SHARP_MODULE);
const digest=path=>createHash('sha256').update(readFileSync(path)).digest('hex');
const assets=readdirSync('public/images/products/remix').filter(f=>f.endsWith('.webp')&&f.includes('REMIX')).map(f=>'images/products/remix/'+f);
for(const name of ['pet.webp','person.webp']) assets.push('images/'+name);
const output='public/images/responsive';mkdirSync(output,{recursive:true});
const expected=new Set();const manifest={};
for(const asset of assets.sort()){
  const origin=join('public',asset);
  assert.ok(statSync(origin).isFile(),origin);
  const info=await sharp(origin).metadata();
  assert.equal(info.format,'webp',origin);
  assert.ok(info.width>0&&info.height>0,origin);
  const basenameWithoutExtension=basename(asset,'.webp');
  const originals={src:'/'+asset,width:info.width,bytes:statSync(origin).size,sha256:digest(origin)};
  const variants=[];
  for(const width of [480,768,1024]){
    if(info.width<=width+24) continue;
    const generated=join(output,`${basenameWithoutExtension}__w${width}.webp`);
    await sharp(origin).resize({width,withoutEnlargement:true,fit:'inside'}).webp({quality:90,effort:5}).toFile(generated);
    if(statSync(generated).size>=statSync(origin).size){rmSync(generated);continue;}
    expected.add(basename(generated));
    variants.push({src:'/images/responsive/'+basename(generated),width,bytes:statSync(generated).size,sha256:digest(generated)});
  }
  manifest['/'+asset]={sourceWidth:info.width,sourceSha256:originals.sha256,variants:[...variants,originals].sort((a,b)=>a.width-b.width)};
}
for(const file of readdirSync(output)) if(file.endsWith('.webp')&&!expected.has(file)) rmSync(join(output,file));
writeFileSync('lib/responsive-images.json',JSON.stringify(manifest,null,2)+'\n');
console.log(`Image provenance: ${assets.length} WebP originals untouched, ${expected.size} static derivatives; manifest lib/responsive-images.json`);
