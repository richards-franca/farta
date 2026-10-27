import { NextResponse } from 'next/server';
import { getIdentity } from '@/lib/backend/identity';
import { getSiteUrl } from '@/lib/supabase/env';

export async function GET() {
  const current=await getIdentity();
  if(!current) return NextResponse.redirect(new URL('/auth/login',getSiteUrl()));
  const {profile}=current;
  if (profile?.status !== 'ACTIVE') return NextResponse.redirect(new URL('/acesso-negado', getSiteUrl()));
  const destination = profile.role === 'DRIVER' ? '/operacao/entregas' : profile.role === 'INTERNAL_OPERATOR' ? '/operacao/pedidos' : profile.role === 'PLATFORM_ADMIN' ? '/admin/empresas' : '/';
  return NextResponse.redirect(new URL(destination, getSiteUrl()));
}
