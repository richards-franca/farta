import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import nextEnv from '@next/env';
import {createClient} from '@supabase/supabase-js';
import {createServerClient} from '@supabase/ssr';
import {deleteSmokeAccount} from './lib/delete-smoke-account.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
nextEnv.loadEnvConfig(root);
if(process.env.FARTA_LIVE_SMOKE!=='1')throw new Error('Set FARTA_LIVE_SMOKE=1 to authorize one temporary pending account.');
const duration=Number(process.argv[2]??900);
if(!Number.isInteger(duration)||duration<0||duration>900)throw new Error('Duration must be 0..900 seconds.');
const filename=process.env.FARTA_SMOKE_REPORT??`vps-smoke-${new Date().toISOString().slice(0,10)}.json`;
if(!/^[a-z0-9.-]+\.json$/i.test(filename))throw new Error('Invalid report filename');
const directory=path.join(root,'docs/deployment/validation');fs.mkdirSync(directory,{recursive:true});
const projectRef=fs.readFileSync(path.join(root,'supabase/.temp/project-ref'),'utf8').trim();
if(!/^[a-z]{20}$/.test(projectRef))throw new Error('Invalid project reference');
const keys=cp.spawnSync('cmd.exe',['/d','/s','/c',`npx.cmd supabase projects api-keys --project-ref ${projectRef} -o json`],{cwd:root,encoding:'utf8',timeout:60000});
if(keys.status)throw new Error('Unable to authorize temporary test account');
const service=JSON.parse(keys.stdout).find(k=>k.name==='service_role')?.api_key;
if(!service)throw new Error('Test credential unavailable');
const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const admin=createClient(url,service,{auth:{persistSession:false,autoRefreshToken:false}});
const email=`farta-vps-smoke-${randomUUID()}@example.invalid`,password=randomUUID()+'aA1!';
let userId,stopping=false;
process.on('SIGINT',()=>{stopping=true;});
const report={createdAt:new Date().toISOString(),target:'https://farta.site',concurrency:10,durationSeconds:duration,complete:false,requests:0,failures:0,errorCounts:{},errorEvents:[],p95Milliseconds:0,temporaryAccountDeleted:false,scope:'Authenticated pending-account SSR and backend identity; no customer orders or business data are written.'};
const save=()=>fs.writeFileSync(path.join(directory,filename),JSON.stringify(report,null,2)+'\n');
function failure(kind){report.failures++;report.errorCounts[kind]=(report.errorCounts[kind]??0)+1;if(report.errorEvents.length<20)report.errorEvents.push({at:new Date().toISOString(),kind});}
try {
 const created=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:'Validação técnica temporária'}});
 if(created.error||!created.data.user)throw new Error('Unable to create the temporary pending account');
 userId=created.data.user.id;
 const jar=new Map();
 const auth=createServerClient(url,key,{cookies:{getAll:()=>[...jar].map(([name,value])=>({name,value})),setAll:values=>{for(const cookie of values)jar.set(cookie.name,cookie.value);}}});
 const login=await auth.auth.signInWithPassword({email,password});
 if(login.error||!login.data.session)throw new Error('Temporary account login failed');
 const cookie=[...jar].map(([name,value])=>`${name}=${value}`).join('; ');
 const health=await fetch('https://farta.site/api/health',{signal:AbortSignal.timeout(15_000)});
 if(!health.ok)throw new Error('Public health check failed');
 const page=await fetch('https://farta.site/auth/login',{signal:AbortSignal.timeout(15_000)});
 if(!page.ok || !(await page.text()).includes('Farta'))throw new Error('Login page did not render');
 const samples=[];
 async function request(){
  const start=performance.now();
  try {
   const response=await fetch('https://farta.site/auth/after-login',{headers:{cookie},redirect:'manual',signal:AbortSignal.timeout(20_000)});
   if(response.status!==307 || new URL(response.headers.get('location'),'https://farta.site').pathname!=='/acesso-negado')failure(`HTTP_${response.status}`);
   await response.arrayBuffer();
  } catch(error) {failure(String(error.cause?.code??error.name??'NETWORK_ERROR').replace(/[^A-Z0-9_]/gi,''));}
  samples.push(performance.now()-start);report.requests++;
 }
 await request();
 save();
 if(report.failures)throw new Error('Pending user was not safely denied after the web/API identity check');
 console.log('Public HTTPS, login page, session cookies and web-to-API identity flow passed. Starting concurrency measurement.');
 const end=Date.now()+duration*1000;
 let lastReport=Date.now();
 await Promise.all(Array.from({length:10},async()=>{
  while(!stopping&&Date.now()<end){await request();if(Date.now()-lastReport>60_000){lastReport=Date.now();save();console.log(`Measurement: ${report.requests} requests, ${report.failures} failures; ${JSON.stringify(report.errorCounts)}.`);}await new Promise(resolve=>setTimeout(resolve,5000));}
 }));
 samples.sort((a,b)=>a-b);report.p95Milliseconds=Math.round(samples[Math.min(samples.length-1,Math.floor(samples.length*.95))]);
 report.complete=!stopping;
} finally {
 save();
 if(userId){report.temporaryAccountDeleted=await deleteSmokeAccount(admin,userId);if(!report.temporaryAccountDeleted)throw new Error('Temporary account was not eligible for automatic cleanup');}
 save();
 console.log(JSON.stringify(report));
}
if(report.failures)process.exitCode=1;
