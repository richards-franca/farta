import test from 'node:test';
import assert from 'node:assert/strict';
import { buildApp, imageType } from '../src/app.js';
import { routes } from '@farta/contracts';
import { authenticate } from '../src/auth.js';

const userId='11111111-1111-4111-8111-111111111111';
const companyId='22222222-2222-4222-8222-222222222222';
function fixture({role='CUSTOMER',status='ACTIVE',membership=true,down=false}={}) {
  const requests: Array<{url:URL;authorization:string|null;body:unknown}>=[];
  const upstream:typeof fetch=async(input,init)=>{
    const url=new URL(String(input));
    const authorization=new Headers(init?.headers).get('authorization');
    requests.push({url,authorization,body:typeof init?.body==='string'?JSON.parse(init.body):undefined});
    if(down) return Response.json({message:'private database error'},{status:503});
    if(url.pathname==='/auth/v1/user') {
      if(authorization!=='Bearer valid-user-token') return Response.json({message:'invalid token'},{status:401});
      return Response.json({id:userId,email:'customer@example.invalid',aud:'authenticated',role:'authenticated',created_at:'2026-01-01',app_metadata:{},user_metadata:{}});
    }
    if(url.pathname.endsWith('/profiles')) return Response.json([{id:userId,company_id:companyId,role,status,full_name:'Test',phone:null}]);
    if(url.pathname.endsWith('/company_memberships')) return Response.json(membership?[{id:'membership'}]:[]);
    if(url.pathname.endsWith('/companies')) return Response.json([{display_name:'Company A'}]);
    if(url.pathname.startsWith('/storage/v1/object/catalog-banners/')) return Response.json({Id:userId,Key:'catalog-banners/test.png'});
    if(url.pathname.endsWith('/rpc/admin_create_banner')) return Response.json({id:userId,status:'INACTIVE'});
    if(url.pathname.endsWith('/rpc/list_direct_messages')) return Response.json([]);
    if(url.pathname.endsWith('/rpc/accept_company_invitation')) return Response.json([{company_id:companyId,company_name:'Company A'}]);
    return Response.json([]);
  };
  return {requests,config:{supabaseUrl:'https://test.supabase.invalid',supabaseKey:'public-test-key',fetch:upstream}};
}
const headers={authorization:'Bearer valid-user-token','content-type':'application/json'};
test('health and schema initialization do not require a live provider',async()=>{
  const f=fixture();const app=await buildApp(f.config);
  try {assert.equal((await app.inject('/health/live')).statusCode,200);assert.equal(f.requests.length,0);} finally {await app.close();}
});
test('business endpoint rejects missing and forged credentials',async()=>{
  const f=fixture();const app=await buildApp(f.config);
  try {
    const url=routes['chat.chat.listDirectMessages'].path;
    assert.equal((await app.inject({method:'POST',url,payload:{args:[companyId]}})).statusCode,401);
    assert.equal((await app.inject({method:'POST',url,headers:{authorization:'Bearer forged'},payload:{args:[companyId]}})).statusCode,401);
  } finally {await app.close();}
});
test('role is resolved from profile; customers cannot call admin operations',async()=>{
  const f=fixture();const app=await buildApp(f.config);
  try {const result=await app.inject({method:'POST',url:routes['admin.admin.listCompanies'].path,headers,payload:{args:[]}});assert.equal(result.statusCode,403);assert.equal(f.requests.some(r=>r.url.pathname.includes('/rpc/')),false);} finally {await app.close();}
});
test('inactive profiles and removed memberships are denied',async()=>{
  for(const state of [{status:'INACTIVE'},{membership:false}]) {
    const f=fixture(state);const app=await buildApp(f.config);
    try {assert.equal((await app.inject({method:'POST',url:routes['chat.chat.listDirectMessages'].path,headers,payload:{args:[companyId]}})).statusCode,403);} finally {await app.close();}
  }
});
test('only validated user tokens reach RPC; tenant override fields are rejected',async()=>{
  const f=fixture();const app=await buildApp(f.config);
  try {
    const url=routes['chat.chat.listDirectMessages'].path;
    const result=await app.inject({method:'POST',url,headers,payload:{args:[companyId]}});
    assert.equal(result.statusCode,200);assert.deepEqual(result.json(),{ok:true,messages:[]});
    const rpc=f.requests.find(r=>r.url.pathname.endsWith('/rpc/list_direct_messages'))!;
    assert.equal(rpc.authorization,'Bearer valid-user-token');
    assert.deepEqual(rpc.body,{p_conversation_id:companyId});
    assert.equal((await app.inject({method:'POST',url,headers,payload:{args:[companyId],role:'PLATFORM_ADMIN',companyId}})).statusCode,400);
    assert.equal((await app.inject({method:'POST',url,headers,payload:{args:['not-a-uuid']}})).statusCode,400);
  } finally {await app.close();}
});
test('pending users can accept invitations but cannot access the catalog',async()=>{
  const f=fixture({status:'PENDING',membership:false});const app=await buildApp(f.config);
  try {
    assert.equal((await app.inject({method:'POST',url:routes['invitations.invitation.acceptCompanyInvitation'].path,headers,payload:{args:[{token:'a'.repeat(64)}]}})).statusCode,200);
    assert.equal((await app.inject({method:'POST',url:routes['orders.order.listCatalog'].path,headers,payload:{args:[]}})).statusCode,403);
  } finally {await app.close();}
});
test('provider outages return 503 without leaking upstream details',async()=>{
  const f=fixture({down:true});const app=await buildApp(f.config);
  try {const response=await app.inject({method:'POST',url:routes['chat.chat.listDirectMessages'].path,headers,payload:{args:[companyId]}});assert.equal(response.statusCode,503);assert.equal(response.body.includes('private database error'),false);} finally {await app.close();}
});
test('provider clients and sessions are isolated between concurrent requests',async()=>{
  const f=fixture();
  const results=await Promise.allSettled([authenticate('valid-user-token',f.config),authenticate('forged',f.config)]);
  assert.equal(results[0].status,'fulfilled');assert.equal(results[1].status,'rejected');
  if(results[0].status==='fulfilled') assert.equal(results[0].value.user.id,userId);
});
test('image signature validation rejects disguised uploads',()=>{
  assert.equal(imageType(Buffer.from('<script>alert(1)</script>')),undefined);
  assert.equal(imageType(Buffer.from([137,80,78,71,13,10,26,10])),'image/png');
});
test('malformed JSON and unsupported content types are client errors',async()=>{
 const f=fixture();const app=await buildApp(f.config);
 try{
  const url=routes['chat.chat.listDirectMessages'].path;
  const malformed=await app.inject({method:'POST',url,headers,payload:'{'});
  assert.equal(malformed.statusCode,400);
  const unsupported=await app.inject({method:'POST',url,headers:{authorization:headers.authorization,'content-type':'application/xml'},payload:'<args/>'});
  assert.equal(unsupported.statusCode,415);
 }finally{await app.close();}
});
test('upload endpoint rejects incorrect bytes before calling storage',async()=>{
  const f=fixture({role:'PLATFORM_ADMIN'});const app=await buildApp(f.config);
  try {
    const boundary='test-boundary';
    const payload=`--${boundary}\r\nContent-Disposition: form-data; name="input"\r\n\r\n${JSON.stringify({productId:companyId,altText:'Test'})}\r\n--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.png"\r\nContent-Type: image/png\r\n\r\nnot-an-image\r\n--${boundary}--\r\n`;
    const result=await app.inject({method:'POST',url:routes['admin.admin.uploadAdminProductImage'].path,headers:{authorization:headers.authorization,'content-type':`multipart/form-data; boundary=${boundary}`},payload});
    assert.equal(result.statusCode,400);assert.equal(f.requests.some(r=>r.url.pathname.includes('/storage/')),false);
  } finally {await app.close();}
});

test('valid banner multipart upload reaches private Storage and the authorized RPC',async()=>{
 const f=fixture({role:'PLATFORM_ADMIN'});const app=await buildApp(f.config);
 try {
  const form=new FormData();
  form.set('input',JSON.stringify({title:'Test banner',altText:'Test image',sortOrder:0,status:'INACTIVE'}));
  form.set('file',new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==','base64')],{type:'image/png'}),'test.png');
  const encoded=new Response(form);
  const result=await app.inject({method:'POST',url:routes['banners.banner.createAdminBanner'].path,headers:{authorization:headers.authorization,'content-type':encoded.headers.get('content-type')!},payload:Buffer.from(await encoded.arrayBuffer())});
  assert.equal(result.statusCode,200,result.body);
  assert.equal(result.json().ok,true,result.body);
  assert.equal(f.requests.some(r=>r.url.pathname.includes('/storage/v1/object/catalog-banners/')),true);
  const rpc=f.requests.find(r=>r.url.pathname.endsWith('/rpc/admin_create_banner'))!;
  assert.equal(rpc.authorization,'Bearer valid-user-token');
  assert.equal((rpc.body as {p_status:string}).p_status,'INACTIVE');
 } finally {await app.close();}
});
