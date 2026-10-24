import { NextResponse } from 'next/server';
import { getIdentity } from '@/lib/backend/identity';

export async function GET(request: Request) {
  const current=await getIdentity();
  if(!current) return NextResponse.redirect(new URL('/auth/login',request.url));
  const {profile}=current;
  if (profile?.status !== 'ACTIVE') return NextResponse.redirect(new URL('/acesso-negado', request.url));
  const destination = profile.role === 'DRIVER' ? '/operacao/entregas' : profile.role === 'INTERNAL_OPERATOR' ? '/operacao/pedidos' : profile.role === 'PLATFORM_ADMIN' ? '/admin/empresas' : '/';
  return NextResponse.redirect(new URL(destination, request.url));
}
