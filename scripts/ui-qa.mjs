// Only the disposable CI Supabase may receive these fixtures.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {spawn} from 'node:child_process';
import fs from 'node:fs';
import {chromium,expect} from '@playwright/test';
import {createClient} from '@supabase/supabase-js';
const provider=process.env.FARTA_TEST_SUPABASE_URL;
assert.ok(provider&&['127.0.0.1','localhost'].includes(new URL(provider).hostname),'Refusing UI fixtures outside local Supabase');
assert.equal(process.env.NEXT_PUBLIC_SITE_URL,'http://127.0.0.1:3000');
const admin=createClient(provider,process.env.FARTA_TEST_SERVICE_KEY,{auth:{persistSession:false,autoRefreshToken:false}});
const company='00000000-0000-0000-0000-000000000001';
const output='test-results/customer-ui';fs.mkdirSync(output,{recursive:true});
const report={bannerLifecycle:false,customerJourney:false,responsiveWidths:[],consoleErrors:[]};
const processes=[];let browser;
const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==','base64');
async function account(role){
 const email=`ui-${randomUUID()}@example.invalid`,password=randomUUID()+'aA1!';
 const created=await admin.auth.admin.createUser({email,password,email_confirm:true});assert.equal(created.error,null);const id=created.data.user.id;
 const updated=await admin.from('profiles').update({role,status:'ACTIVE',company_id:role==='CUSTOMER'?company:null,full_name:'Cliente de teste'}).eq('id',id);assert.equal(updated.error,null);
 if(role==='CUSTOMER'){const membership=await admin.from('company_memberships').upsert({company_id:company,profile_id:id,status:'ACTIVE'});assert.equal(membership.error,null);}
 return {email,password};
}
async function ready(url){for(let i=0;i<90;i++){try{if((await fetch(url)).ok)return;}catch{}await new Promise(r=>setTimeout(r,1000));}throw Error('UI test server did not become ready');}
async function login(page,who){await page.goto('http://127.0.0.1:3000/auth/login');await page.getByLabel('E-mail',{exact:true}).fill(who.email);await page.getByLabel('Senha',{exact:true}).fill(who.password);await page.getByRole('button',{name:'Entrar',exact:true}).click();await page.waitForURL(url=>!url.pathname.startsWith('/auth/'));assert.equal(new URL(page.url()).origin,'http://127.0.0.1:3000');}
async function screenshot(page,name){await page.screenshot({path:`${output}/${name}.png`,fullPage:true});}
try {
 const platform=await account('PLATFORM_ADMIN'),customer=await account('CUSTOMER');
 processes.push(spawn(process.execPath,['node_modules/tsx/dist/cli.mjs','services/api/src/server.ts'],{env:{...process.env,SUPABASE_URL:provider,SUPABASE_ANON_KEY:process.env.FARTA_TEST_ANON_KEY},stdio:'ignore'}));
 processes.push(spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1'],{env:process.env,stdio:'ignore'}));
 await ready('http://127.0.0.1:3001/health/live');await ready('http://127.0.0.1:3000/api/health');
 browser=await chromium.launch();
 const adminContext=await browser.newContext({viewport:{width:1303,height:900}}),clientContext=await browser.newContext({viewport:{width:1440,height:1000}});
 const adminPage=await adminContext.newPage(),client=await clientContext.newPage();
 for(const page of [adminPage,client]){page.on('pageerror',e=>report.consoleErrors.push(e.message));page.setDefaultTimeout(30000);}
 await login(adminPage,platform);await adminPage.goto('http://127.0.0.1:3000/admin/banners');
 await adminPage.getByLabel('Arquivo',{exact:true}).setInputFiles({name:'banner.png',mimeType:'image/png',buffer:png});
 await adminPage.getByLabel('Título opcional').fill('Destaque de validação');await adminPage.getByLabel('Texto alternativo',{exact:true}).fill('Imagem de validação');
 await adminPage.getByRole('button',{name:'Cadastrar banner',exact:true}).click();
 await expect(adminPage.getByRole('status')).toContainText('Banner cadastrado como inativo');
 await login(client,customer);await client.goto('http://127.0.0.1:3000/catalogo');
 await expect(client.getByRole('status').filter({hasText:'Carregando catálogo'})).toHaveCount(0);
 await expect(client.getByRole('region',{name:'Destaques'})).toHaveCount(0);
 await adminPage.getByLabel('Status',{exact:true}).selectOption('ACTIVE');await adminPage.getByRole('button',{name:'Salvar banner',exact:true}).click();await expect(adminPage.getByRole('status')).toContainText('Banner atualizado');
 await client.reload();await expect(client.getByRole('heading',{name:'Destaque de validação'})).toBeVisible();
 await expect(client.getByRole('region',{name:'Destaques'}).locator('img')).toHaveJSProperty('naturalWidth',1);
 await screenshot(adminPage,'banner-admin');
 await screenshot(client,'catalog-empty');
 // Verify manual rotation and inactive filtering using a second banner fixture.
 const second=await admin.from('banners').insert({storage_object_path:'https://example.invalid/unavailable.png',mime_type:'image/png',byte_size:1,title:'Segundo destaque',alt_text:'Imagem indisponível',status:'ACTIVE',sort_order:1});assert.equal(second.error,null);
 await client.reload();await client.getByRole('button',{name:'Próximo destaque',exact:true}).click();await expect(client.getByRole('heading',{name:'Segundo destaque'})).toBeVisible();
 await client.getByRole('button',{name:'Pausar rotação'}).click();await expect(client.getByRole('button',{name:'Retomar rotação'})).toHaveAttribute('aria-pressed','true');
 await client.getByRole('button',{name:'Destaque anterior',exact:true}).click();await expect(client.getByRole('heading',{name:'Destaque de validação'})).toBeVisible();
 await adminPage.getByLabel('Status',{exact:true}).selectOption('INACTIVE');await adminPage.getByRole('button',{name:'Salvar banner',exact:true}).click();await expect(adminPage.getByRole('status')).toContainText('Banner atualizado');
 await client.reload();await expect(client.getByRole('heading',{name:'Destaque de validação'})).toHaveCount(0);report.bannerLifecycle=true;
 await client.getByRole('button',{name:'Adicionar',exact:true}).first().click();await expect(client.getByRole('link',{name:'Ver pedido, 1 produtos distintos'})).toBeVisible();
 await screenshot(client,'catalog-filled');
 for(const width of [320,390,768,1024,1440]){
  await client.setViewportSize({width,height:1000});await client.evaluate(()=>document.fonts.ready);
  assert.ok(await client.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1),`Global horizontal overflow at ${width}`);
  await screenshot(client,`catalog-${width}`);report.responsiveWidths.push(width);
 }
 await client.setViewportSize({width:1440,height:1000});await client.goto('http://127.0.0.1:3000/pedido');await expect(client.getByRole('heading',{name:'Seus produtos'})).toBeVisible();await screenshot(client,'checkout');
 await client.goto('http://127.0.0.1:3000/perfil');await expect(client.getByRole('heading',{name:'Meu perfil'})).toBeVisible();await screenshot(client,'profile');
 await client.goto('http://127.0.0.1:3000/pedidos');await expect(client.getByRole('heading',{name:/pedidos/i}).first()).toBeVisible();await screenshot(client,'orders');
 await client.goto('http://127.0.0.1:3000/notificacoes');await screenshot(client,'notifications');
 await client.goto('http://127.0.0.1:3000/mensagens');await screenshot(client,'messages');
 await client.goto('http://127.0.0.1:3000/admin/banners');assert.ok(!new URL(client.url()).pathname.startsWith('/admin/'),'Customer reached banner admin');
 report.customerJourney=true;assert.deepEqual(report.consoleErrors,[]);
 console.log('UI checks passed: banner lifecycle, customer pages, role protection and five responsive widths.');
} finally {
 if(browser)await browser.close();for(const child of processes)child.kill('SIGTERM');
 fs.writeFileSync(`${output}/report.json`,JSON.stringify(report,null,2));
}
