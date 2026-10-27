import {NextResponse} from 'next/server';
import {getSiteUrl} from '@/lib/supabase/env';
import {signIn} from '@/modules/auth/auth.actions';

// A stable URL keeps a login form usable when a deployment replaces action IDs.
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(getSiteUrl()).origin)return NextResponse.json({ok:false,message:'Acesso não autorizado.'},{status:403});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return NextResponse.json({ok:false,message:'Formato de envio inválido.'},{status:415});
 const reader=request.body?.getReader();if(!reader)return NextResponse.json({ok:false,message:'Informe e-mail e senha.'},{status:400});
 const chunks:Uint8Array[]=[];let size=0;
 try{
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>4096){await reader.cancel();return NextResponse.json({ok:false,message:'Dados acima do limite permitido.'},{status:413});}chunks.push(value);}
  const input=JSON.parse(Buffer.concat(chunks).toString('utf8'));
  if(!input||typeof input.email!=='string'||typeof input.password!=='string'||input.email.length>320||input.password.length>1024)return NextResponse.json({ok:false,message:'Confira o e-mail e a senha.'},{status:400});
  const result=await signIn({email:input.email,password:input.password});
  return NextResponse.json(result,{status:result.ok?200:400});
 }catch(error){
  if(error instanceof SyntaxError)return NextResponse.json({ok:false,message:'Dados de envio inválidos.'},{status:400});
  return NextResponse.json({ok:false,message:'Não foi possível concluir o acesso. Tente novamente em instantes.'},{status:503});
 }
}
