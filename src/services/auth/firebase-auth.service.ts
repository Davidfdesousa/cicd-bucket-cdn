import { initializeApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth';

import { resolveFirebaseConfig, type FirebaseConfigResult } from '../../config/firebase.config.ts';
import { createStore } from '../../lib/store.ts';
import { isPopupBlocked, toAuthError } from './auth-errors.ts';
import type { AuthService, AuthState, AuthUser } from './auth.types.ts';

function toAuthUser(user: User): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoUrl: user.photoURL,
  };
}

function createUnconfiguredService(missingKeys: string[]): AuthService {
  const store = createStore<AuthState>({ status: 'unconfigured', missingKeys });
  const reject = () =>
    Promise.reject(new Error(`Firebase não configurado. Variáveis ausentes: ${missingKeys.join(', ')}`));

  return {
    getState: store.get,
    subscribe: store.subscribe,
    signInWithGoogle: reject,
    signOut: reject,
  };
}

/**
 * Google sign-in backed by Firebase Authentication.
 * Uses a popup by default and falls back to a full-page redirect when the
 * browser blocks popups (common on mobile and in embedded webviews).
 */
export function createFirebaseAuthService(
  config: FirebaseConfigResult = resolveFirebaseConfig(),
): AuthService {
  if (config.status === 'missing') {
    return createUnconfiguredService(config.missingKeys);
  }

  const store = createStore<AuthState>({ status: 'loading' });
  const auth = getAuth(initializeApp(config.options));
  auth.useDeviceLanguage();

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });

  onAuthStateChanged(auth, (user) => {
    store.set(user ? { status: 'signed-in', user: toAuthUser(user) } : { status: 'signed-out' });
  });

  getRedirectResult(auth).catch((error: unknown) => {
    const authError = toAuthError(error);
    if (authError) store.set({ status: 'signed-out', error: authError });
  });

  return {
    getState: store.get,
    subscribe: store.subscribe,

    async signInWithGoogle() {
      try {
        await signInWithPopup(auth, provider);
      } catch (error) {
        if (isPopupBlocked(error)) {
          await signInWithRedirect(auth, provider);
          return;
        }

        const authError = toAuthError(error);
        store.set(authError ? { status: 'signed-out', error: authError } : { status: 'signed-out' });
      }
    },

    async signOut() {
      await signOut(auth);
    },
  };
}
