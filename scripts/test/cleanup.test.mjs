import test from 'node:test';
import assert from 'node:assert/strict';
import {deleteSmokeAccount} from '../lib/delete-smoke-account.mjs';
function fixture({email='farta-vps-smoke-11111111@example.invalid',company_id=null,status='PENDING',referenced=false}={}) {
 const calls=[];let deleting=false;
 const chain={eq(){return chain;},is(){return chain;},async maybeSingle(){return {data:{id:'fixture',company_id,status},error:null};},select(){return deleting?Promise.resolve({data:[{id:'fixture'}],error:referenced?{code:'23503'}:null}):chain;},delete(){deleting=true;calls.push('profile');return chain;}};
 const client={from(){return chain;},auth:{admin:{async getUserById(){return {data:{user:{email,user_metadata:{full_name:'Validação técnica temporária'}}},error:null};},async deleteUser(){calls.push('auth');return {error:null};}}}};
 return {client,calls};
}
test('cleanup refuses accounts outside its fixture namespace',async()=>{const f=fixture({email:'real-customer@example.invalid'});assert.equal(await deleteSmokeAccount(f.client,'fixture'),false);assert.deepEqual(f.calls,[]);});
test('cleanup refuses activated or linked profiles',async()=>{for(const state of [{company_id:'company'},{status:'ACTIVE'}]){const f=fixture(state);assert.equal(await deleteSmokeAccount(f.client,'fixture'),false);assert.deepEqual(f.calls,[]);}});
test('cleanup observes FK safety and deletes profile before Auth fixture',async()=>{const f=fixture();assert.equal(await deleteSmokeAccount(f.client,'fixture'),true);assert.deepEqual(f.calls,['profile','auth']);const protectedFixture=fixture({referenced:true});await assert.rejects(()=>deleteSmokeAccount(protectedFixture.client,'fixture'));assert.deepEqual(protectedFixture.calls,['profile']);});
