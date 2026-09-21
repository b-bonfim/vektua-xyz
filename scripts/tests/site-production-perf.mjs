// Synthetic LOCAL PRODUCTION BUILD measurements, not deployed Core Web Vitals or INP.
// Run the EXACT same script / profiles before and after image changes on the same runner.
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
const require = createRequire(import.meta.url);
assert.ok(process.env.PLAYWRIGHT_MODULE, 'PLAYWRIGHT_MODULE required');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE);
const base = process.env.BASE_URL || 'http://127.0.0.1:8787';
const output = process.env.PERF_OUTPUT || 'perf-baseline';
const commit = process.env.PERF_SHA || process.env.GITHUB_SHA || 'UNRECORDED';
const routes = ['/', '/busca', '/produto/g-org-rc-01'];
const profiles = [
  { name:'mobile', width:390,height:844,mobile:true,touch:true,dpr:2,latency:150,down:200_000,up:100_000,cpu:4 },
  { name:'desktop', width:1440,height:900,mobile:false,touch:false,dpr:1,latency:40,down:1_250_000,up:500_000,cpu:1 },
];
const repeats=3;
mkdirSync(output,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const results=[];
let failed=false;
try {
  for(const profile of profiles) for(const route of routes) for(let repetition=1;repetition<=repeats;repetition++){
    const context=await browser.newContext({viewport:{width:profile.width,height:profile.height},isMobile:profile.mobile,hasTouch:profile.touch,deviceScaleFactor:profile.dpr,serviceWorkers:'block',reducedMotion:'reduce'});
    const page=await context.newPage();
    const cdp=await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
    await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:profile.latency,downloadThroughput:profile.down,uploadThroughput:profile.up});
    await cdp.send('Emulation.setCPUThrottlingRate',{rate:profile.cpu});
    const requests=new Map(),errors=[];
    cdp.on('Network.responseReceived',({requestId,response,type})=>requests.set(requestId,{url:response.url,type,status:response.status,mime:response.mimeType,cacheControl:response.headers?.['cache-control']??response.headers?.['Cache-Control']??null,fromDiskCache:response.fromDiskCache,fromServiceWorker:response.fromServiceWorker,encodedBytes:0}));
    cdp.on('Network.loadingFinished',({requestId,encodedDataLength})=>{const r=requests.get(requestId);if(r)r.encodedBytes=encodedDataLength;});
    cdp.on('Network.loadingFailed',({requestId,errorText})=>errors.push({requestId,error:errorText}));
    page.on('pageerror',error=>errors.push({type:'pageerror',error:error.message}));
    page.on('console',message=>{if(message.type()==='error')errors.push({type:'console',error:message.text()});});
    await page.addInitScript(()=>{
      window.__perfLab={lcp:null,cls:0};
      new PerformanceObserver(list=>{for(const entry of list.getEntries())window.__perfLab.lcp={startTime:entry.startTime,size:entry.size,url:entry.url||null,tag:entry.element?.tagName||null,alt:entry.element?.getAttribute('alt')||null,src:entry.element?.currentSrc||null};}).observe({type:'largest-contentful-paint',buffered:true});
      new PerformanceObserver(list=>{for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__perfLab.cls+=entry.value;}).observe({type:'layout-shift',buffered:true});
    });
    let result={status:'FAIL',route,profile:profile.name,repetition,commit};
    try{
      const response=await page.goto(`${base}${route}`,{waitUntil:'networkidle',timeout:90_000});
      await page.waitForTimeout(500);
      assert.equal(response?.status(),200,`${route} HTTP status`);
      assert.ok(await page.locator('h1').count(),`${route}: missing h1`);
      if(route.startsWith('/produto/'))assert.ok(await page.locator('.pdp-image img').count(),`${route}: gallery image missing`);
      const metrics=await page.evaluate(()=>{
        const nav=performance.getEntriesByType('navigation')[0];
        return {fcpMs:performance.getEntriesByName('first-contentful-paint')[0]?.startTime??null,ttfbMs:nav?.responseStart??null,navigationMs:nav?.duration??null,...window.__perfLab,images:[...document.images].map(i=>({src:i.currentSrc,alt:i.alt,loading:i.loading,fetchPriority:i.fetchPriority,naturalWidth:i.naturalWidth,naturalHeight:i.naturalHeight,cssWidth:Math.round(i.getBoundingClientRect().width),cssHeight:Math.round(i.getBoundingClientRect().height),top:Math.round(i.getBoundingClientRect().top),srcset:i.srcset,sizes:i.sizes,complete:i.complete}))};
      });
      const net=[...requests.values()],imageRequests=net.filter(r=>r.mime?.startsWith('image/')||r.type==='Image');
      if(repetition===1)await page.screenshot({path:`${output}/${profile.name}-${route==='/'?'home':route.slice(1).replaceAll('/','-')}-1.png`,fullPage:true});
      result={...result,...metrics,network:{latencyMs:profile.latency,downloadBytesPerSecond:profile.down,uploadBytesPerSecond:profile.up,cpuSlowdown:profile.cpu,cacheDisabled:true},transfer:{totalBytes:net.reduce((s,r)=>s+r.encodedBytes,0),imageBytes:imageRequests.reduce((s,r)=>s+r.encodedBytes,0),requests:net.length,imageRequests:imageRequests.length},requests:net,errors};
      // EXISTING baseline framework defect is not silently suppressed: save every error,
      // classify as WARN and report it. Any new or different error fails the run.
      const known=errors.filter(e=>e.type==='console'&&e.error?.includes('[vinext] RSC prefetch setup error: TypeError: ne is not a function'));
      const unexpected=errors.filter(e=>!known.includes(e)&&!(e.error||'').includes('ERR_ABORTED'));
      assert.deepEqual(unexpected,[],`${route}: unexpected browser errors`);
      result.status=known.length?'WARN_EXISTING_VINEXT_PREFETCH':'PASS';
      console.log(`${result.status} ${profile.name} ${route} repeat=${repetition} LCP=${metrics.lcp?.startTime??'N/A'} FCP=${metrics.fcpMs??'N/A'} CLS=${metrics.cls} transfer=${result.transfer.totalBytes} images=${result.transfer.imageBytes} existingPrefetchErrors=${known.length}`);
    }catch(error){
      failed=true;result={...result,status:'FAIL',error:String(error),errors};
      console.error(`FAIL ${profile.name} ${route} repeat=${repetition}: ${error}`);
    }
    results.push(result);
    await context.close();
  }
}finally{await browser.close();}
const complete={commit,base,mode:'LOCAL_PRODUCTION_BUILD_LAB_NOT_DEPLOYED',node:process.version,chromium:browser.version(),repeats,profiles,routes,results};
writeFileSync(`${output}/results.json`,JSON.stringify(complete,null,2));
const fmt=(r,key)=>r.map(x=>{const value=key==='lcp'?x.lcp?.startTime:key==='imageBytes'?x.transfer?.imageBytes:key==='totalBytes'?x.transfer?.totalBytes:x[key];return typeof value==='number'?value.toFixed(key==='cls'?4:0):'N/A';}).join(', ');
const summary=['# LOCAL production build — laboratory measurements; NO deploy',`Commit ${commit}; ${repeats} repetitions per profile/route; no field INP.`, 'Known Vinext RSC prefetch console errors are present in the unoptimized baseline. They are explicitly logged as WARN_EXISTING_VINEXT_PREFETCH, not considered fixed.', '|Profile|Route|Status|LCP ms|CLS|FCP ms|TTFB ms|Transferred bytes|Image bytes|','|---|---|---|---|---|---|---|---|---|',...profiles.flatMap(p=>routes.map(route=>{const r=results.filter(x=>x.profile===p.name&&x.route===route);return `|${p.name}|${route}|${r.map(x=>x.status).join(', ')}|${fmt(r,'lcp')}|${fmt(r,'cls')}|${fmt(r,'fcpMs')}|${fmt(r,'ttfbMs')}|${fmt(r,'totalBytes')}|${fmt(r,'imageBytes')}|`;}))];
writeFileSync(`${output}/summary.md`,summary.join('\n')+'\n');
console.log(`samples=${results.length} unexpectedFailures=${results.filter(r=>r.status==='FAIL').length} existingFrameworkWarnings=${results.filter(r=>r.status==='WARN_EXISTING_VINEXT_PREFETCH').length}`);
if(failed)process.exitCode=1;
