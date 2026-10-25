import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareDumpScript} from '../lib/prepare-dump.mjs';
const ref='aaaaaaaaaaaaaaaaaaaa';
const script="export PGHOST='db.example.invalid'\nexport PGUSER='cli_login_postgres'\nexport PGPORT='5432'\nexport PGPASSWORD='fixture-only-placeholder'\npg_dump --role=postgres\n";
test('backup uses the IPv4-compatible session pooler with the same temporary role',()=>{
 const result=prepareDumpScript(script,'postgresql://postgres.'+ref+'@aws-1-sa-east-1.pooler.supabase.com:5432/postgres',ref);
 assert.ok(result.includes("PGHOST='aws-1-sa-east-1.pooler.supabase.com'"));assert.ok(result.includes("PGUSER='cli_login_postgres."+ref+"'"));assert.ok(result.includes("PGPASSWORD='fixture-only-placeholder'"));
});
test('backup normalization never duplicates the project suffix',()=>{
 const result=prepareDumpScript(script.replace('cli_login_postgres','cli_login_postgres.'+ref),'postgresql://aws-1-sa-east-1.pooler.supabase.com/postgres',ref);
 assert.equal(result.includes(ref+'.'+ref),false);
});
test('backup rejects untrusted hosts and malformed role syntax',()=>{
 assert.throws(()=>prepareDumpScript(script,'postgresql://untrusted.example.invalid/postgres',ref));
 assert.throws(()=>prepareDumpScript(script.replace('cli_login_postgres','invalid;role'),'postgresql://aws-1-sa-east-1.pooler.supabase.com/postgres',ref));
});
