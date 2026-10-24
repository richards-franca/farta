import {createClient} from '../context.js';
import type {AuthResult} from '@farta/contracts';
const GENERIC_AUTH_ERROR = 'Não foi possível atualizar o perfil.';
export async function updateMyPhone(phone: string): Promise<AuthResult> {
  const value = phone.trim();
  const digits = value.replace(/\D/g, '');
  if (digits && !((digits.startsWith('55') && (digits.length === 12 || digits.length === 13)) || digits.length === 10 || digits.length === 11)) {
    return { ok: false, message: 'Informe um telefone brasileiro válido ou deixe o campo vazio.' };
  }
  const { error } = await (await createClient()).rpc('update_my_profile_phone', { p_phone: value });
  if (error) {
    if (error.message.includes('INVALID_PHONE')) return { ok: false, message: 'Informe um telefone brasileiro válido ou deixe o campo vazio.' };
    if (error.message.includes('FORBIDDEN')) return { ok: false, message: 'Seu perfil não pode atualizar este contato.' };
    return { ok: false, message: GENERIC_AUTH_ERROR };
  }
  return { ok: true, message: digits ? 'Telefone atualizado.' : 'Telefone removido do perfil.' };
}
