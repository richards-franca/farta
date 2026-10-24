import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types.js';
import type { RequestContext, Role } from './context.js';

export class ApiError extends Error {
  constructor(public statusCode: number, public code: string, message: string) { super(message); }
}
export interface ApiConfig { supabaseUrl: string; supabaseKey: string; fetch?: typeof fetch }
export async function authenticate(token: string, config: ApiConfig): Promise<RequestContext> {
  let upstreamFailed = false;
  const upstreamFetch: typeof fetch = async (input, init) => {
    try {
      const response = await (config.fetch ?? fetch)(input, { ...init, signal: AbortSignal.timeout(15_000) });
      if (response.status >= 500) upstreamFailed = true;
      return response;
    } catch (error) { upstreamFailed = true; throw error; }
  };
  const supabase = createClient<Database>(config.supabaseUrl, config.supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: `Bearer ${token}` }, fetch: upstreamFetch },
  });
  const { data: { user }, error } = await supabase.auth.getUser(token);
  if (upstreamFailed) throw new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'Serviço temporariamente indisponível. Tente novamente em instantes.');
  if (error || !user) throw new ApiError(401, 'UNAUTHENTICATED', 'Entre novamente para continuar.');
  const { data: profile, error: profileError } = await supabase.from('profiles')
    .select('id,company_id,role,status,full_name,phone').eq('id', user.id).maybeSingle();
  if (upstreamFailed || profileError) throw new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'Não foi possível verificar seu acesso.');
  if (!profile) throw new ApiError(403, 'PROFILE_REQUIRED', 'Seu perfil ainda não está disponível.');
  return {
    supabase, user: { id: user.id, email: user.email }, profile: { ...profile, role: profile.role as Role },
    get upstreamFailed() { return upstreamFailed; }, set upstreamFailed(value) { upstreamFailed = value; },
  };
}

export async function authorize(context: RequestContext, operation: string) {
  if (operation === 'identity.me' || operation === 'invitations.invitation.acceptCompanyInvitation') return;
  if (context.profile.status !== 'ACTIVE') throw new ApiError(403, 'INACTIVE_PROFILE', 'Seu acesso não está ativo.');
  const { role, company_id: companyId } = context.profile;
  let allowed: Role[] | undefined;
  if (operation.startsWith('admin.')) {
    const name = operation.split('.').at(-1)!;
    const operational = ['getCompanyOrderDetails', 'listCompanyOrders', 'listCompanyDrivers', 'assignCompanyOrderDriver', 'startCompanyOrderPicking', 'setOrderFinalPrices', 'advanceOrderStatus'];
    allowed = operational.includes(name) ? ['PLATFORM_ADMIN','INTERNAL_OPERATOR'] : ['PLATFORM_ADMIN'];
    if (['getCompanyOrderDetails','listCompanyOrders','advanceOrderStatus'].includes(name)) allowed.push('DRIVER');
  } else if (operation.startsWith('orders.') || operation.startsWith('customer.')) allowed = ['CUSTOMER'];
  else if (operation.startsWith('invitations.')) allowed = ['PLATFORM_ADMIN'];
  else if (operation.includes('Admin')) allowed = ['PLATFORM_ADMIN'];
  if (allowed && !allowed.includes(role)) throw new ApiError(403, 'FORBIDDEN', 'Você não tem permissão para esta operação.');
  if (role !== 'PLATFORM_ADMIN') {
    if (!companyId) throw new ApiError(403, 'MEMBERSHIP_REQUIRED', 'Seu vínculo com a empresa não está ativo.');
    const { data, error } = await context.supabase.from('company_memberships').select('id')
      .eq('company_id',companyId).eq('profile_id',context.user.id).eq('status','ACTIVE').maybeSingle();
    if (error || context.upstreamFailed) throw new ApiError(503, 'UPSTREAM_UNAVAILABLE', 'Não foi possível verificar seu acesso.');
    if (!data) throw new ApiError(403, 'MEMBERSHIP_REQUIRED', 'Seu vínculo com a empresa não está ativo.');
  }
}
