import {getIdentity} from '@/lib/backend/identity';
import {redirect} from 'next/navigation';
export async function getCurrentUser() {
  const current=await getIdentity();
  return current?.profile.status==='ACTIVE'?current:null;
}
export async function requireCustomerPage() {
  const current=await getCurrentUser();
  if(!current) redirect('/auth/login');
  if(current.profile.role!=='CUSTOMER') redirect('/acesso-negado?area=cliente');
  return current;
}
