import assert from 'node:assert/strict';
const site='https://farta.site';
for(const [route,target] of [
 ['/auth/after-login','/auth/login'],
 ['/auth/callback','/auth/login?error=auth_callback'],
 ['/auth/callback?provider=google&error=access_denied','/auth/login?error=google_cancelled'],
 ['/auth/invite/accept?token=invalid','/auth/invite?error=invite'],
 ['/?code=redirect-regression-probe','/auth/callback?code=redirect-regression-probe'],
]) {
 const response=await fetch(site+route,{redirect:'manual',signal:AbortSignal.timeout(15_000)});
 assert.equal(response.status,307,route);
 assert.equal(response.headers.get('location'),new URL(target,site).href,route);
 await response.arrayBuffer();
 console.log(`${route}: redirect stays on the public domain`);
}
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
