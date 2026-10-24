import { AsyncLocalStorage } from 'node:async_hooks';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './database.types.js';

export type Role = 'CUSTOMER' | 'INTERNAL_OPERATOR' | 'DRIVER' | 'PLATFORM_ADMIN';
export interface RequestContext {
  supabase: SupabaseClient<Database>;
  user: { id: string; email?: string };
  profile: { id: string; company_id: string | null; role: Role; status: string; full_name: string; phone: string | null };
  establishmentId?: string;
  upstreamFailed: boolean;
}
export const requestContext = new AsyncLocalStorage<RequestContext>();
export function getContext(): RequestContext {
  const context = requestContext.getStore();
  if (!context) throw new Error('Authenticated request context required');
  return context;
}
export async function createClient() { return getContext().supabase; }

// The selected establishment is untrusted input, revalidated by the use case.
export async function cookies() {
  return {
    get: (name: string) => { void name; return getContext().establishmentId ? { value: getContext().establishmentId! } : undefined; },
    set: (name: string, value: string, options: object) => { void name; void options; getContext().establishmentId = value; },
  };
}
