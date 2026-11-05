import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../components/button/button.ts';
import '../components/card/card.ts';
import '../components/icon/icon.ts';
import type { AuthError } from '../services/auth/index.ts';
import { baseStyles } from '../styles/shared.styles.ts';

/**
 * @fires sign-in - The user asked to sign in with Google.
 */
@customElement('app-login-page')
export class AppLoginPage extends LitElement {
  static override styles = [
    baseStyles,
    css`
      :host {
        display: grid;
        place-items: center;
        min-block-size: 100%;
        padding: var(--spacing-inset-md);
      }

      app-card {
        inline-size: min(100%, 26rem);
      }

      .content {
        display: grid;
        gap: var(--spacing-stack-lg);
      }

      h1 {
        margin: 0;
        color: var(--color-content-strong);
        font-size: var(--typography-title-md-size);
        font-weight: var(--typography-title-weight);
        line-height: var(--typography-title-line-height);
      }

      p {
        margin: var(--spacing-stack-xs) 0 0;
        color: var(--color-content-subtle);
      }

      .error {
        display: flex;
        gap: var(--spacing-inline-xs);
        padding: var(--spacing-inset-sm) var(--spacing-inset-md);
        border: 1px solid var(--color-border-danger);
        border-radius: var(--radius-control);
        background: var(--color-bg-danger-subtle);
        color: var(--color-content-danger);
        font-size: var(--typography-body-sm-size);
      }
    `,
  ];

  @property() heading = '';
  @property() description = '';
  @property({ type: Boolean }) pending = false;
  @property({ attribute: false }) error: AuthError | undefined;

  private requestSignIn(): void {
    this.dispatchEvent(new CustomEvent('sign-in', { bubbles: true, composed: true }));
  }

  override render() {
    return html`
      <app-card padding="xl">
        <div class="content">
          <div>
            <h1>${this.heading}</h1>
            <p>${this.description}</p>
          </div>

          ${
            this.error
              ? html`<div class="error" role="alert">
                  <app-icon name="alert-circle"></app-icon>
                  <span>${this.error.message}</span>
                </div>`
              : nothing
          }

          <app-button full-width ?loading=${this.pending} @click=${this.requestSignIn}>
            <app-icon slot="icon-start" name="log-in"></app-icon>
            Entrar com Google
          </app-button>
        </div>
      </app-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-login-page': AppLoginPage;
  }

  interface HTMLElementEventMap {
    'sign-in': CustomEvent<void>;
  }
}
