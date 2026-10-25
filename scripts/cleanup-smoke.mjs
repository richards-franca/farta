import fs from 'node:fs';
import path from 'node:path';
import cp from 'node:child_process';
import {fileURLToPath} from 'node:url';
import nextEnv from '@next/env';
import {createClient} from '@supabase/supabase-js';
import {deleteSmokeAccount} from './lib/delete-smoke-account.mjs';
if(process.env.FARTA_LIVE_SMOKE!=='1')throw new Error('Set FARTA_LIVE_SMOKE=1; run only after confirming no smoke test is active.');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');nextEnv.loadEnvConfig(root);
const ref=fs.readFileSync(path.join(root,'supabase/.temp/project-ref'),'utf8').trim();
if(!/^[a-z]{20}$/.test(ref))throw new Error('Invalid project reference');
const result=cp.spawnSync('cmd.exe',['/d','/s','/c',`npx.cmd supabase projects api-keys --project-ref ${ref} -o json`],{cwd:root,encoding:'utf8',timeout:60000});
if(result.status)throw new Error('Maintenance authentication failed');
const key=JSON.parse(result.stdout).find(k=>k.name==='service_role')?.api_key;
if(!key)throw new Error('Maintenance credential unavailable');
const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,key,{auth:{persistSession:false,autoRefreshToken:false}});
let removed=0,skipped=0;
for(let page=1;;page++){
 const {data,error}=await client.auth.admin.listUsers({page,perPage:1000});if(error)throw new Error('Unable to inspect temporary accounts');
 for(const user of data.users){
  if(!/^farta-vps-smoke-[0-9a-f-]+@example\.invalid$/.test(user.email??'')||user.user_metadata.full_name!=='Validação técnica temporária')continue;
  if(await deleteSmokeAccount(client,user.id))removed++;else skipped++;
 }
 if(data.users.length<1000)break;
}
console.log(JSON.stringify({temporaryAccountsRemoved:removed,skippedForManualReview:skipped}));
