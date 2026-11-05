import type { ReactiveController, ReactiveControllerHost } from 'lit';

import { getAuthService, type AuthService, type AuthState } from '../services/auth/index.ts';

/**
 * Connects a Lit element to the auth service: re-renders the host on every
 * auth state change and exposes the sign-in / sign-out actions.
 */
export class AuthController implements ReactiveController {
  state: AuthState;
  pending = false;

  private unsubscribe: (() => void) | undefined;

  constructor(
    private readonly host: ReactiveControllerHost,
    private readonly service: AuthService = getAuthService(),
  ) {
    this.state = service.getState();
    host.addController(this);
  }

  hostConnected(): void {
    this.unsubscribe = this.service.subscribe((state) => {
      this.state = state;
      this.host.requestUpdate();
    });
  }

  hostDisconnected(): void {
    this.unsubscribe?.();
    this.unsubscribe = undefined;
  }

  signInWithGoogle(): Promise<void> {
    return this.run(() => this.service.signInWithGoogle());
  }

  signOut(): Promise<void> {
    return this.run(() => this.service.signOut());
  }

  private async run(action: () => Promise<void>): Promise<void> {
    this.pending = true;
    this.host.requestUpdate();
    try {
      await action();
    } finally {
      this.pending = false;
      this.host.requestUpdate();
    }
  }
}
