import 'server-only';
import { cache } from 'react';
import { backendFetch, BackendUnavailableError } from './client';
export type Identity = {
  user: {id:string;email?:string};
  profile:{id:string;company_id:string|null;role:'CUSTOMER'|'INTERNAL_OPERATOR'|'DRIVER'|'PLATFORM_ADMIN';full_name:string;phone:string|null;status:string};
  company:{display_name:string}|null;
};
export const getIdentity=cache(async():Promise<Identity|null>=>{
  const response=await backendFetch('/v1/identity/me');
  if(response.status===401 || response.status===403) return null;
  if(!response.ok) throw new BackendUnavailableError();
  return response.json();
});
