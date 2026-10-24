import 'server-only';
import { cookies } from 'next/headers';
import { routes, type Operations, type OperationName } from '@farta/contracts';
import { createClient } from '@/lib/supabase/server';

export class BackendUnavailableError extends Error {
  constructor() { super('A Farta está temporariamente indisponível. Tente novamente em instantes.'); this.name='BackendUnavailableError'; }
}
const selectionCookie = 'prostock-establishment';
export async function backendFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const base = process.env.FARTA_API_URL ?? (process.env.NODE_ENV === 'production' ? undefined : 'http://127.0.0.1:3001');
  const session = await (await createClient()).auth.getSession();
  if (session.error) throw new BackendUnavailableError();
  if (!session.data.session?.access_token) return Response.json({ok:false,message:'Entre novamente para continuar.',code:'UNAUTHENTICATED'},{status:401});
  if (!base) throw new BackendUnavailableError();
  const headers = new Headers(init.headers);
  headers.set('Authorization', `Bearer ${session.data.session.access_token}`);
  const selected = (await cookies()).get(selectionCookie)?.value;
  if(selected) headers.set('x-establishment-id',selected);
  try {
    const response = await fetch(new URL(path,base),{...init,headers,cache:'no-store',signal:AbortSignal.timeout(30_000)});
    if(response.status >= 500) throw new BackendUnavailableError();
    return response;
  } catch { throw new BackendUnavailableError(); }
}

export async function callApi<K extends OperationName>(operation: K, args: Parameters<Operations[K]>): Promise<Awaited<ReturnType<Operations[K]>>> {
  const route=routes[operation];
  let body: BodyInit;
  const headers=new Headers();
  if(route.upload) {
    const input=args[0] as Record<string,unknown>;
    const {file,...metadata}=input;
    if(!(file instanceof File)) throw new Error('Arquivo obrigatório.');
    const form=new FormData();
    form.set('input',JSON.stringify(metadata)); form.set('file',file);
    body=form;
  } else {
    headers.set('Content-Type','application/json');
    body=JSON.stringify({args});
  }
  let response:Response;
  try { response=await backendFetch(route.path,{method:'POST',headers,body}); }
  catch(error) {
    if(!(error instanceof BackendUnavailableError)) throw error;
    return {ok:false,message:error.message,orders:[],notifications:[],products:[],prices:[],categories:[],variants:[],images:[],banners:[],conversations:[],messages:[],addresses:[],drivers:[],establishments:[],cart:null} as Awaited<ReturnType<Operations[K]>>;
  }
  const result=await response.json();
  if(operation==='customer.customer.selectCustomerEstablishment' && result.ok && result.selected?.id) {
    (await cookies()).set(selectionCookie,result.selected.id,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*30});
  }
  // Transport errors preserve the failure shape expected by existing screens.
  if(!response.ok) return {orders:[],notifications:[],products:[],prices:[],categories:[],variants:[],images:[],banners:[],conversations:[],messages:[],addresses:[],drivers:[],establishments:[],cart:null,...result} as Awaited<ReturnType<Operations[K]>>;
  return result;
}
