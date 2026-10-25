import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const require=createRequire(import.meta.url);
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process'),crypto=require('node:crypto');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const home=process.env.USERPROFILE;
if(!process.argv[2])throw new Error('Usage: node scripts/restore-check.mjs <encrypted-backup-directory>');
const folder=path.resolve(process.argv[2]);
if(folder===root||folder.startsWith(root+path.sep))throw new Error('Backup must be outside the repository');
const key=fs.readFileSync(path.join(home,'.ssh/farta_backup.key'));
const name='farta-restore-check-'+crypto.randomUUID().slice(0,8);
function decrypt(file){const b=fs.readFileSync(path.join(folder,file));if(b.subarray(0,6).toString()!=='FARTA1')throw new Error('Invalid archive');const d=crypto.createDecipheriv('aes-256-gcm',key,b.subarray(6,18));d.setAuthTag(b.subarray(18,34));return Buffer.concat([d.update(b.subarray(34)),d.final()]);}
function ssh(command,input,timeout=300000){return cp.spawnSync('ssh',['-i',path.join(home,'.ssh/farta_admin_ed25519'),'-o','BatchMode=yes','-p','22022','farta@143.95.174.202',command],{input,encoding:'utf8',timeout,maxBuffer:64*1024*1024});}
function run(command,input,diagnoseSchema=false){
 const r=ssh(command,input);
 if(r.status){
  const e=r.stderr??'';
  const allowed=['jq','curl','pg_dump','pg_dumpall','docker','supabase','sed','psql','WARNING','WARN','Warning','NOTICE','INFO','Note','Initialising','Initializing','Generating','Dumping','Connecting','Exporting','Using','Skipping','Reusing'];
  const missing=[...e.matchAll(/([a-z_-]+): command not found/gi)].map(m=>allowed.includes(m[1])?m[1]:'other');
  console.log(JSON.stringify({exitCode:r.status,missingCommands:missing,permissionDenied:/permission denied/i.test(e),versionMismatch:/version mismatch/i.test(e),missingObject:/does not exist|not found/i.test(e),connectionFailure:/connection|resolve|timeout/i.test(e),outOfSpace:/space left/i.test(e),sqlState:e.match(/ERROR:\s*([A-Z0-9]{5})/)?.[1]}));
  if(command.includes('postgres:17-bookworm -s')||diagnoseSchema){
   const sanitized=e.split('\n').map(line=>/password|token|secret|PGUSER|PGHOST|PGDATABASE/i.test(line)?'[credential diagnostic omitted]':line.replace(/postgres(?:ql)?:\/\/\S+/gi,'[connection omitted]').replace(/'[^']*'|"[^"]*"/g,'[quoted value omitted]').replace(/[A-Za-z0-9_+=/:.-]{24,}/g,'[identifier omitted]')).join('\n');
   console.log(sanitized.slice(0,1200));
  }
  throw new Error('Isolated restore command failed; raw diagnostic suppressed');
 }
 return r.stdout;
}
let schema=decrypt('managed-schema.sql.aes').toString();
const metadata=JSON.parse(decrypt('restore-metadata.json.aes'));
const sourceRoles=metadata.roleNames;
console.log('Using only encrypted snapshot archives for isolated restoration.');
const password=crypto.randomBytes(24).toString('hex');
let started=false;
const report={createdAt:new Date().toISOString(),source:'encrypted snapshot '+path.basename(folder)+'; managed schema, metadata, data and Storage; no Cloud query',databaseRestored:false,tableCountsMatched:false,storageArchivesAuthenticated:false};
try{
 run(`docker run -d --rm --name ${name} --label com.farta.purpose=restore-test --memory=256m --memory-swap=256m --cpus=0.25 -e POSTGRES_PASSWORD=${password} public.ecr.aws/supabase/postgres:17.6.1.166 postgres -c shared_buffers=32MB -c max_connections=20 -c work_mem=1MB`);started=true;
 run(`for i in $(seq 1 60); do docker exec ${name} pg_isready -U postgres >/dev/null 2>&1 && break; sleep 1; done; sleep 10; docker exec ${name} pg_isready -U postgres >/dev/null`);
 run(`docker exec -e PGPASSWORD=${password} ${name} createdb -U supabase_admin --template=template0 farta_restore`);
 const roles=sourceRoles;
 const prepare=`DO $$ DECLARE n text; BEGIN FOREACH n IN ARRAY ARRAY[${roles.map(r=>`'${r}'`).join(',')}] LOOP IF NOT EXISTS(SELECT 1 FROM pg_roles WHERE rolname=n) THEN EXECUTE format('CREATE ROLE %I',n); END IF; END LOOP; END $$; DROP SCHEMA public CASCADE; CREATE SCHEMA public; CREATE SCHEMA extensions; CREATE EXTENSION btree_gist WITH SCHEMA public; CREATE EXTENSION pgcrypto WITH SCHEMA extensions; CREATE EXTENSION "uuid-ossp" WITH SCHEMA extensions;\n`;
 const target=`docker exec -i -e PGPASSWORD=${password} ${name} psql -X -U supabase_admin -d farta_restore --set=ON_ERROR_STOP=1 --set=VERBOSITY=sqlstate`;
 run(target,prepare);
 schema=schema.replace(/CREATE SCHEMA "(public|extensions)";/g,'CREATE SCHEMA IF NOT EXISTS "$1";').replace("pg_catalog.set_config('search_path', '', false)","pg_catalog.set_config('search_path', 'public,extensions', false)");
 run(target.replace('VERBOSITY=sqlstate','VERBOSITY=terse'),schema,true);
 run(target,Buffer.concat([Buffer.from('SET session_replication_role=replica;\n'),decrypt('data.sql.aes'),Buffer.from('\nSET session_replication_role=origin;\n')]));
 report.databaseRestored=true;
 const data=decrypt('data.sql.aes').toString();
 const essential=['auth.users','public.companies','public.profiles','public.orders','public.order_items','storage.objects'];
 for(const table of essential){
  const [s,t]=table.split('.');
  const header=new RegExp('^COPY "?'+s+'"?\\."?'+t+'"? \\([^\\n]*\\) FROM stdin;\\n','m');
  const match=header.exec(data);if(!match)throw new Error('Expected table is absent from data archive');
  const body=data.slice(match.index+match[0].length).split('\n\\.')[0];
  const expected=body.split('\n').filter(line=>line!=='').length;
  const actual=Number(run(target,`SELECT count(*) FROM ${table};\n`).trim().split('\n').find(line=>/^\s*\d+\s*$/.test(line))?.trim());
  if(actual!==expected)throw new Error('Restored table count differs from snapshot');
 }
 report.tableCountsMatched=true;
 const manifest=JSON.parse(decrypt('storage-manifest.json.aes'));
 for(const object of manifest.objects){const b=decrypt(object.filename);if(object.metadata?.size!==undefined && Number(object.metadata.size)!==b.length)throw new Error('Storage archive size differs from its metadata');}
 report.storageArchivesAuthenticated=true;
}finally{
 if(started){const cleanup=ssh(`docker rm -f -v ${name}`);if(cleanup.status)throw new Error('Temporary restore container cleanup failed');}
 const output=path.join(root,'docs/deployment/validation');fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,'restore-check-'+report.createdAt.slice(0,10)+'.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report));
}
