import {backendFetch} from '@/lib/backend/client';
export const runtime='nodejs';
export async function GET(request:Request,{params}:{params:Promise<{orderId:string}>}) {
  const {orderId}=await params;
  if(!/^[0-9a-f-]{36}$/i.test(orderId)) return new Response('Pedido inválido.',{status:400});
  const format=new URL(request.url).searchParams.get('format')==='pdf'?'pdf':'xlsx';
  const response=await backendFetch('/v1/orders/'+orderId+'/export?format='+format);
  return new Response(response.body,{status:response.status,headers:{'Content-Type':response.headers.get('content-type')??'application/json','Content-Disposition':response.headers.get('content-disposition')??'inline','Cache-Control':'no-store'}});
}
