import type { AuthError } from './auth.types.ts';

const silentCodes = new Set(['auth/popup-closed-by-user', 'auth/cancelled-popup-request']);

const messages: Record<string, string> = {
  'auth/unauthorized-domain':
    'Este domínio não está autorizado no Firebase. Adicione-o em Authentication → Settings → Authorized domains.',
  'auth/operation-not-allowed':
    'O provedor Google não está habilitado no Firebase. Ative-o em Authentication → Sign-in method.',
  'auth/network-request-failed': 'Falha de conexão. Verifique sua internet e tente novamente.',
  'auth/too-many-requests': 'Muitas tentativas seguidas. Aguarde alguns instantes e tente novamente.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/invalid-api-key': 'A API key do Firebase é inválida. Revise as variáveis de ambiente.',
};

const fallbackMessage = 'Não foi possível entrar com o Google. Tente novamente.';

function readCode(error: unknown): string {
  if (typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string') {
    return error.code;
  }
  return 'auth/unknown';
}

/**
 * Converts a Firebase error into a user-facing message.
 * Returns `null` when the error should not be shown (e.g. the user closed the popup).
 */
export function toAuthError(error: unknown): AuthError | null {
  const code = readCode(error);
  if (silentCodes.has(code)) return null;
  return { code, message: messages[code] ?? fallbackMessage };
}

export function isPopupBlocked(error: unknown): boolean {
  return readCode(error) === 'auth/popup-blocked';
}
