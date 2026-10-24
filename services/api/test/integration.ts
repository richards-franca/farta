// Destructive fixtures are restricted to the ephemeral, local Supabase used by CI.
import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {createClient} from '@supabase/supabase-js';
import {buildApp} from '../src/app.js';
import {routes,type OperationName} from '@farta/contracts';

test('real PostgreSQL, Auth, RPC and RLS preserve tenant isolation and the order flow',async()=>{
  const url=process.env.FARTA_TEST_SUPABASE_URL;
  const key=process.env.FARTA_TEST_ANON_KEY;
  const serviceKey=process.env.FARTA_TEST_SERVICE_KEY;
  assert.ok(url && key && serviceKey,'Explicit isolated test configuration is required');
  assert.ok(['127.0.0.1','localhost'].includes(new URL(url).hostname),'Refusing fixtures against a remote database');
  const admin=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
  const companyA='00000000-0000-0000-0000-000000000001',companyB=randomUUID();
  const sku='00000000-0000-0000-0000-000000000301';
  const inserted=await admin.from('companies').insert({id:companyB,legal_name:'CI Company B',display_name:'CI Company B'});
  assert.equal(inserted.error,null,inserted.error?.message);
  async function account(role:string,companyId:string|null) {
    const email=`ci-${randomUUID()}@example.invalid`,password=randomUUID()+'aA1!';
    const created=await admin.auth.admin.createUser({email,password,email_confirm:true});
    assert.equal(created.error,null,created.error?.message);assert.ok(created.data.user);
    const userId=created.data.user.id;
    const profile=await admin.from('profiles').update({role,status:'ACTIVE',company_id:companyId,full_name:'CI Test'}).eq('id',userId);
    assert.equal(profile.error,null,profile.error?.message);
    if(companyId){const membership=await admin.from('company_memberships').upsert({profile_id:userId,company_id:companyId,status:'ACTIVE'});assert.equal(membership.error,null,membership.error?.message);}
    const client=createClient(url!,key!,{auth:{persistSession:false,autoRefreshToken:false}});
    const login=await client.auth.signInWithPassword({email,password});
    assert.equal(login.error,null,login.error?.message);assert.ok(login.data.session);
    return {userId,client,token:login.data.session.access_token};
  }
  const a=await account('CUSTOMER',companyA),b=await account('CUSTOMER',companyB),platform=await account('PLATFORM_ADMIN',null);
  const app=await buildApp({supabaseUrl:url,supabaseKey:key});
  async function call(who:typeof a,operation:OperationName,args:unknown[]=[]) {
    const result=await app.inject({method:'POST',url:routes[operation].path,headers:{authorization:`Bearer ${who.token}`},payload:{args}});
    assert.equal(result.statusCode,200,`${operation}: ${result.body}`);
    return result.json();
  }
  try {
    const context=await call(a,'customer.customer.getCustomerContext');assert.equal(context.ok,true);assert.ok(context.selected.id);
    const catalog=await call(a,'orders.order.listCatalog');assert.equal(catalog.ok,true);assert.ok(catalog.products.some((p:{skuId:string;priceMinor:number})=>p.skuId===sku && p.priceMinor===299));
    const catalogB=await call(b,'orders.order.listCatalog');assert.equal(catalogB.ok,true);assert.ok(catalogB.products.every((p:{priceMinor:number|null})=>p.priceMinor===null));
    const address=await call(a,'customer.customer.createAddress',[{label:'CI',addressLine:'Test Street',addressNumber:'1',addressComplement:'',district:'Centro',city:'Vitória',state:'ES',postalCode:'29000000'}]);assert.equal(address.ok,true);
    const hidden=await b.client.from('addresses').select('id').eq('id',address.addressId);assert.equal(hidden.error,null);assert.deepEqual(hidden.data,[]);
    assert.equal((await call(a,'orders.order.addCatalogItem',[sku,1])).ok,true);
    const cart=await call(a,'orders.order.getActiveCart');assert.equal(cart.ok,true);assert.ok(cart.cart.id);
    const submitted=await call(a,'orders.order.confirmActiveCart',[{cartId:cart.cart.id,addressId:address.addressId,deliveryWindow:'Hoje',customerNote:'CI isolated order'}]);assert.equal(submitted.ok,true,submitted.message);assert.ok(submitted.orderId);
    const foreign=await call(b,'orders.order.getOrderDetails',[submitted.orderId]);assert.equal(foreign.ok,false);
    const final=await call(platform,'admin.admin.setOrderFinalPrices',[submitted.orderId,[{skuId:sku,unitPriceMinor:299}]]);assert.equal(final.ok,true,final.message);
    const confirmed=await call(a,'orders.order.confirmFinalOrderPrice',[submitted.orderId]);assert.equal(confirmed.ok,true,confirmed.message);
    assert.equal((await call(a,'orders.order.confirmFinalOrderPrice',[submitted.orderId])).ok,true);
    const details=await call(a,'orders.order.getOrderDetails',[submitted.orderId]);assert.equal(details.ok,true);assert.equal(details.order.totalMinor,299);
    for(const format of ['pdf','xlsx']){const exported=await app.inject({url:`/v1/orders/${submitted.orderId}/export?format=${format}`,headers:{authorization:`Bearer ${platform.token}`}});assert.equal(exported.statusCode,200,exported.body);assert.ok(exported.rawPayload.length>100);}
    const forbidden=await app.inject({method:'POST',url:routes['admin.admin.listCompanies'].path,headers:{authorization:`Bearer ${a.token}`},payload:{args:[]}});assert.equal(forbidden.statusCode,403);
    const revoked=await admin.from('company_memberships').update({status:'REVOKED'}).eq('profile_id',a.userId);assert.equal(revoked.error,null,revoked.error?.message);
    const denied=await app.inject({method:'POST',url:routes['orders.order.listCatalog'].path,headers:{authorization:`Bearer ${a.token}`},payload:{args:[]}});assert.equal(denied.statusCode,403);
  } finally {await app.close();}
});
