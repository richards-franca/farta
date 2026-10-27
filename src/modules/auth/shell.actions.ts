'use server';
import { getIdentity } from '@/lib/backend/identity';
export async function getShellIdentity() {
 const identity=await getIdentity();
 return identity ? {name:identity.profile.full_name,role:identity.profile.role} : null;
}
