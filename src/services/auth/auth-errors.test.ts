import { describe, expect, it } from 'vitest';

import { isPopupBlocked, toAuthError } from './auth-errors.ts';

describe('toAuthError', () => {
  it('returns null when the user just closed the popup', () => {
    expect(toAuthError({ code: 'auth/popup-closed-by-user' })).toBeNull();
  });

  it('maps known Firebase codes to a friendly message', () => {
    const error = toAuthError({ code: 'auth/unauthorized-domain' });

    expect(error?.code).toBe('auth/unauthorized-domain');
    expect(error?.message).toContain('Authorized domains');
  });

  it('falls back to a generic message for unknown errors', () => {
    expect(toAuthError(new Error('boom'))).toEqual({
      code: 'auth/unknown',
      message: 'Não foi possível entrar com o Google. Tente novamente.',
    });
  });
});

describe('isPopupBlocked', () => {
  it('detects the popup-blocked code', () => {
    expect(isPopupBlocked({ code: 'auth/popup-blocked' })).toBe(true);
    expect(isPopupBlocked({ code: 'auth/network-request-failed' })).toBe(false);
  });
});
