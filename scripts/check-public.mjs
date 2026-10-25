import assert from 'node:assert/strict';
const site='https://farta.site';
for(const [url,status] of [[site+'/api/health',200],[site+'/auth/login',200],['https://www.farta.site/',301],['http://farta.site/',308]]){
 const response=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(15_000)});
 assert.equal(response.status,status,url);
 await response.arrayBuffer();
 console.log(`${url}: ${status}`);
}
const page=await fetch(site+'/auth/login');
const html=await page.text();
const assets=[...html.matchAll(/(?:href|src)="(\/_next\/static\/[^"?]+)(?:\?[^\"]*)?"/g)].map(m=>m[1]);
assert.ok(assets.length>0,'Login page has no static assets');
for(const asset of [...new Set(assets)].slice(0,5)){
 const response=await fetch(new URL(asset,site),{signal:AbortSignal.timeout(15_000)});
 assert.equal(response.status,200,asset);await response.arrayBuffer();
}
console.log('Static JS/CSS assets are available over HTTPS.');
