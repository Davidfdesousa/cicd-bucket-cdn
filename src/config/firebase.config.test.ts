import { describe, expect, it } from 'vitest';

import { resolveFirebaseConfig } from './firebase.config.ts';

const completeEnv = {
  VITE_FIREBASE_API_KEY: 'api-key',
  VITE_FIREBASE_AUTH_DOMAIN: 'demo.firebaseapp.com',
  VITE_FIREBASE_PROJECT_ID: 'demo',
  VITE_FIREBASE_APP_ID: '1:123:web:abc',
};

describe('resolveFirebaseConfig', () => {
  it('builds Firebase options when every key is present', () => {
    expect(resolveFirebaseConfig(completeEnv)).toEqual({
      status: 'configured',
      options: {
        apiKey: 'api-key',
        authDomain: 'demo.firebaseapp.com',
        projectId: 'demo',
        appId: '1:123:web:abc',
      },
    });
  });

  it('lists missing and blank keys', () => {
    const result = resolveFirebaseConfig({
      ...completeEnv,
      VITE_FIREBASE_APP_ID: '  ',
      VITE_FIREBASE_API_KEY: '',
    });

    expect(result).toEqual({
      status: 'missing',
      missingKeys: ['VITE_FIREBASE_API_KEY', 'VITE_FIREBASE_APP_ID'],
    });
  });
});
