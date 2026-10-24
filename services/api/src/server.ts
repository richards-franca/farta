import { buildApp } from './app.js';
const supabaseUrl=process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey=process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if(!supabaseUrl || !supabaseKey) throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required');
const app=await buildApp({supabaseUrl,supabaseKey,logger:true});
for(const signal of ['SIGINT','SIGTERM']) process.once(signal,()=>{ void app.close().then(()=>process.exit(0)); });
await app.listen({host:process.env.API_HOST ?? '127.0.0.1',port:Number(process.env.API_PORT ?? 3001)});
