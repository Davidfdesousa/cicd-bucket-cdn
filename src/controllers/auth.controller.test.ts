import { LitElement } from 'lit';
import { describe, expect, it, vi } from 'vitest';

import { createStore } from '../lib/store.ts';
import type { AuthService, AuthState } from '../services/auth/index.ts';
import { AuthController } from './auth.controller.ts';

function createFakeService(initial: AuthState = { status: 'signed-out' }) {
  const store = createStore<AuthState>(initial);
  const service: AuthService = {
    getState: store.get,
    subscribe: store.subscribe,
    signInWithGoogle: vi.fn(async () => {
      store.set({
        status: 'signed-in',
        user: { uid: '1', displayName: 'Ada', email: 'ada@example.com', photoUrl: null },
      });
    }),
    signOut: vi.fn(async () => {
      store.set({ status: 'signed-out' });
    }),
  };
  return { service, store };
}

class TestHost extends LitElement {
  auth!: AuthController;
}
customElements.define('test-auth-host', TestHost);

function createHost(service: AuthService): TestHost {
  const host = document.createElement('test-auth-host') as TestHost;
  host.auth = new AuthController(host, service);
  document.body.append(host);
  return host;
}

describe('AuthController', () => {
  it('mirrors the service state while connected', async () => {
    const { service, store } = createFakeService();
    const host = createHost(service);

    store.set({ status: 'loading' });
    expect(host.auth.state).toEqual({ status: 'loading' });
  });

  it('toggles pending around sign-in and ends signed in', async () => {
    const { service } = createFakeService();
    const host = createHost(service);

    const signIn = host.auth.signInWithGoogle();
    expect(host.auth.pending).toBe(true);
    await signIn;

    expect(host.auth.pending).toBe(false);
    expect(host.auth.state.status).toBe('signed-in');
  });

  it('stops listening after the host disconnects', () => {
    const { service, store } = createFakeService();
    const host = createHost(service);

    host.remove();
    store.set({ status: 'loading' });

    expect(host.auth.state).toEqual({ status: 'signed-out' });
  });
});
