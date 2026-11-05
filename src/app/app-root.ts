import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

import '../components/header/header.ts';
import { appConfig } from '../config/app.config.ts';
import { AuthController } from '../controllers/auth.controller.ts';
import '../pages/home-page.ts';
import '../pages/login-page.ts';
import '../pages/setup-page.ts';
import { baseStyles } from '../styles/shared.styles.ts';

/**
 * Application shell. Owns the auth state and decides which page to render.
 * Pages stay stateless: data goes down as properties, actions come up as events.
 */
@customElement('app-root')
export class AppRoot extends LitElement {
  static override styles = [
    baseStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        min-block-size: 100dvh;
      }

      main {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      main > * {
        flex: 1;
      }

      .loading {
        display: grid;
        place-items: center;
        color: var(--color-content-muted);
      }
    `,
  ];

  private readonly auth = new AuthController(this);

  private renderPage() {
    const { state, pending } = this.auth;

    switch (state.status) {
      case 'loading':
        return html`<div class="loading" role="status">Carregando…</div>`;
      case 'unconfigured':
        return html`<app-setup-page .missingKeys=${state.missingKeys}></app-setup-page>`;
      case 'signed-out':
        return html`<app-login-page
          heading=${appConfig.title}
          description="Entre com sua conta Google para continuar."
          ?pending=${pending}
          .error=${state.error}
          @sign-in=${() => this.auth.signInWithGoogle()}
        ></app-login-page>`;
      case 'signed-in':
        return html`<app-home-page .user=${state.user}></app-home-page>`;
    }
  }

  override render() {
    const user = this.auth.state.status === 'signed-in' ? this.auth.state.user : null;

    return html`
      <app-header brand=${appConfig.title} .user=${user} @sign-out=${() => this.auth.signOut()}></app-header>
      <main>${this.renderPage()}</main>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
