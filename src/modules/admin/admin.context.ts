import {redirect} from 'next/navigation';
import {getCurrentUser} from '@/lib/auth/current-user';
export async function requirePlatformAdmin() {
 const current=await getCurrentUser();
 if(!current) redirect('/auth/login');
 if(current.profile.role!=='PLATFORM_ADMIN') redirect('/acesso-negado?area=admin');
 return {user:current.user};
}
export async function requireCompanyOperator() {
 const current=await getCurrentUser();
 if(!current) redirect('/auth/login');
 if(!['INTERNAL_OPERATOR','DRIVER'].includes(current.profile.role)||!current.profile.company_id) redirect('/acesso-negado?area=operacao');
 return {user:current.user,companyId:current.profile.company_id,role:current.profile.role as 'INTERNAL_OPERATOR'|'DRIVER'};
}
