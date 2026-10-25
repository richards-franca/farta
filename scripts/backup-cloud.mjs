import cp from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import nextEnv from '@next/env';
import {createClient} from '@supabase/supabase-js';
import {prepareDumpScript} from './lib/prepare-dump.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const projectRef=fs.readFileSync(path.join(root,'supabase/.temp/project-ref'),'utf8').trim();
const poolerUrl=fs.readFileSync(path.join(root,'supabase/.temp/pooler-url'),'utf8').trim();
const keyPath=path.join(process.env.USERPROFILE,'.ssh','farta_backup.key');
if(!fs.existsSync(keyPath))fs.writeFileSync(keyPath,crypto.randomBytes(32),{mode:0o600});
const key=fs.readFileSync(keyPath);
const folder=path.join(process.env.USERPROFILE,'Documents','Farta-private-backups',new Date().toISOString().replace(/[:.]/g,'-'));
fs.mkdirSync(folder,{recursive:true});
let connectionScript;
for(const [name,flags] of [['roles','--role-only'],['schema',''],['data','--data-only --use-copy']]){
 const dry=cp.spawnSync('cmd.exe',['/d','/s','/c',`npx.cmd --yes supabase@2.122.0 db dump --linked --dry-run ${flags}`],{cwd:root,encoding:'utf8',timeout:60000,maxBuffer:10*1024*1024});
 if(dry.status || !dry.stdout.includes('pg_dump'))throw new Error(`Unable to prepare ${name} export`);
 const script=prepareDumpScript(dry.stdout,poolerUrl,projectRef);
 connectionScript=script;
 const syntax=cp.spawnSync('ssh',['-i',path.join(process.env.USERPROFILE,'.ssh','farta_admin_ed25519'),'-o','BatchMode=yes','-p','22022','root@143.95.174.202','bash -n'],{input:script,timeout:30000});
 if(syntax.status)throw new Error('Generated dump command failed syntax validation');
 const dump=cp.spawnSync('ssh',['-i',path.join(process.env.USERPROFILE,'.ssh','farta_admin_ed25519'),'-o','BatchMode=yes','-p','22022','root@143.95.174.202','docker run --rm -i --network host --entrypoint bash postgres:17-bookworm -s'],{input:script,timeout:300000,maxBuffer:128*1024*1024});
 if(dump.status)throw new Error(`${name} export failed (code ${dump.status}); raw diagnostic suppressed to protect credentials`);
 const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key,iv);
 const encrypted=Buffer.concat([cipher.update(dump.stdout),cipher.final()]);
 fs.writeFileSync(path.join(folder,name+'.sql.aes'),Buffer.concat([Buffer.from('FARTA1'),iv,cipher.getAuthTag(),encrypted]),{mode:0o600});
 console.log(`${name}: encrypted backup saved (${dump.stdout.length} source bytes)`);
}
console.log('Backup directory: '+folder);
function encrypt(name,buffer) {
 const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key,iv);
 const encrypted=Buffer.concat([cipher.update(buffer),cipher.final()]);
 fs.writeFileSync(path.join(folder,name),Buffer.concat([Buffer.from('FARTA1'),iv,cipher.getAuthTag(),encrypted]),{mode:0o600});
}
function exportSupplement(command) {
 const environment=connectionScript.split('\n').filter(line=>/^export [A-Z_]+=/.test(line)).join('\n');
 const result=cp.spawnSync('ssh',['-i',path.join(process.env.USERPROFILE,'.ssh','farta_admin_ed25519'),'-o','BatchMode=yes','-p','22022','root@143.95.174.202','docker run --rm -i --network host --entrypoint bash postgres:17-bookworm -s'],{input:environment+'\n'+command+'\n',timeout:300000,maxBuffer:128*1024*1024});
 if(result.status)throw new Error('Supplemental schema export failed; raw diagnostics suppressed');
 return result.stdout;
}
const managed=exportSupplement('pg_dump --role=postgres --schema-only --no-owner --quote-all-identifiers --schema=public --schema=auth --schema=storage --schema=extensions');
if(!/CREATE TABLE "auth"\."users"/.test(managed.toString())||!/CREATE TABLE "storage"\."objects"/.test(managed.toString()))throw new Error('Managed schema export is incomplete');
encrypt('managed-schema.sql.aes',managed);
const metadata=exportSupplement(`psql -X -qAt -v ON_ERROR_STOP=1 -c 'SET ROLE postgres' -c "SELECT json_build_object('serverVersion', current_setting('server_version'), 'roleNames', (SELECT json_agg(rolname ORDER BY rolname) FROM pg_roles), 'extensions', (SELECT json_agg(json_build_object('name', e.extname, 'schema', n.nspname, 'version', e.extversion)) FROM pg_extension e JOIN pg_namespace n ON n.oid=e.extnamespace))"`);
JSON.parse(metadata.toString());
encrypt('restore-metadata.json.aes',metadata);
console.log('Managed Auth/Storage schema and restoration metadata encrypted.');
async function backupStorage() {
 nextEnv.loadEnvConfig(root);
 const projectRef=fs.readFileSync(path.join(root,'supabase/.temp/project-ref'),'utf8').trim();
 if(!/^[a-z]{20}$/.test(projectRef))throw new Error('Invalid linked project reference');
 const keys=cp.spawnSync('cmd.exe',['/d','/s','/c',`npx.cmd supabase projects api-keys --project-ref ${projectRef} -o json`],{cwd:root,encoding:'utf8',timeout:60000});
 if(keys.status)throw new Error('Unable to obtain the storage backup credential');
 const service=JSON.parse(keys.stdout).find(k=>k.name==='service_role')?.api_key;
 if(!service)throw new Error('Storage backup credential is not available');
 const client=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,service,{auth:{persistSession:false,autoRefreshToken:false}});
 const {data:buckets,error}=await client.storage.listBuckets();
 if(error)throw new Error('Unable to list storage buckets');
 const manifest={createdAt:new Date().toISOString(),buckets,objects:[]};
 async function walk(bucket,prefix='',depth=0) {
  if(depth>32)throw new Error('Storage hierarchy exceeds the supported depth');
  for(let offset=0;;offset+=1000){
   const {data,error}=await client.storage.from(bucket).list(prefix,{limit:1000,offset,sortBy:{column:'name',order:'asc'}});
   if(error)throw new Error('Unable to enumerate storage objects');
   for(const item of data??[]){
    const objectPath=prefix?`${prefix}/${item.name}`:item.name;
    if(!item.id){await walk(bucket,objectPath,depth+1);continue;}
    const {data:blob,error:downloadError}=await client.storage.from(bucket).download(objectPath);
    if(downloadError||!blob)throw new Error('Unable to download a storage object');
    const filename=crypto.createHash('sha256').update(bucket+'\0'+objectPath).digest('hex')+'.object.aes';
    encrypt(filename,Buffer.from(await blob.arrayBuffer()));
    manifest.objects.push({bucket,path:objectPath,filename,metadata:item.metadata});
   }
   if(!data||data.length<1000)break;
  }
 }
 for(const bucket of buckets??[])await walk(bucket.id);
 encrypt('storage-manifest.json.aes',Buffer.from(JSON.stringify(manifest)));
 // Authenticate every encrypted archive before reporting success. No plaintext is persisted.
 for(const name of fs.readdirSync(folder)){
  const archive=fs.readFileSync(path.join(folder,name));
  if(archive.subarray(0,6).toString()!=='FARTA1')throw new Error('Invalid archive header');
  const decipher=crypto.createDecipheriv('aes-256-gcm',key,archive.subarray(6,18));
  decipher.setAuthTag(archive.subarray(18,34));decipher.update(archive.subarray(34));decipher.final();
 }
 console.log(`Storage: ${buckets.length} buckets and ${manifest.objects.length} objects encrypted; all archive authentication checks passed.`);
}
backupStorage().catch(()=>{console.error('Storage backup failed; SQL archives were retained. Credentials and raw diagnostics are suppressed.');process.exitCode=1;});
