import { getSiteUrl } from '@/lib/supabase/env';
import {NextResponse} from 'next/server';
import {getIdentity} from '@/lib/backend/identity';
import {acceptCompanyInvitation} from '@/modules/invitations/invitation.actions';
export async function GET(request:Request) {
 const token=new URL(request.url).searchParams.get('token')??'';
 if(!/^[0-9a-f]{64}$/i.test(token)) return NextResponse.redirect(new URL('/auth/invite?error=invite',getSiteUrl()));
 if(!(await getIdentity())) return NextResponse.redirect(new URL('/auth/login?invite='+encodeURIComponent(token),getSiteUrl()));
 const result=await acceptCompanyInvitation({token});
 if(!result.ok) return NextResponse.redirect(new URL('/auth/invite?token='+token+'&error=invite',getSiteUrl()));
 return NextResponse.redirect(new URL('/auth/after-login',getSiteUrl()));
}
