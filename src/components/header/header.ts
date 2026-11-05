import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import type { AuthUser } from '../../services/auth/index.ts';
import { baseStyles } from '../../styles/shared.styles.ts';
import '../avatar/avatar.ts';
import '../button/button.ts';
import '../icon/icon.ts';
import '../theme-toggle/theme-toggle.ts';

/**
 * @fires sign-out - The user asked to sign out.
 */
@customElement('app-header')
export class AppHeader extends LitElement {
  static override styles = [
    baseStyles,
    css`
      :host {
        display: block;
        border-block-end: 1px solid var(--color-border-default);
        background: var(--color-bg-default);
      }

      .container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--spacing-inline-md);
        max-inline-size: var(--layout-content-max-width);
        margin-inline: auto;
        padding-block: var(--spacing-inset-sm);
        padding-inline: var(--spacing-inset-md);
      }

      .brand {
        margin: 0;
        color: var(--color-content-strong);
        font-size: var(--typography-body-md-size);
        font-weight: var(--typography-title-weight);
      }

      .actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-inline-xs);
      }

      .user {
        display: flex;
        align-items: center;
        gap: var(--spacing-inline-xs);
        color: var(--color-content-subtle);
        font-size: var(--typography-body-sm-size);
      }

      @media (max-width: 40rem) {
        .user-name {
          display: none;
        }
      }
    `,
  ];

  @property() brand = '';
  @property({ attribute: false }) user: AuthUser | null = null;

  private requestSignOut(): void {
    this.dispatchEvent(new CustomEvent('sign-out', { bubbles: true, composed: true }));
  }

  private renderUser(user: AuthUser) {
    const name = user.displayName ?? user.email ?? 'Usuário';

    return html`
      <div class="user">
        <app-avatar name=${name} src=${user.photoUrl ?? nothing}></app-avatar>
        <span class="user-name">${name}</span>
      </div>
      <app-button variant="ghost" size="sm" @click=${this.requestSignOut}>
        <app-icon slot="icon-start" name="log-out"></app-icon>
        Sair
      </app-button>
    `;
  }

  override render() {
    return html`
      <header class="container">
        <p class="brand">${this.brand}</p>
        <div class="actions">
          ${this.user ? this.renderUser(this.user) : nothing}
          <app-theme-toggle></app-theme-toggle>
        </div>
      </header>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-header': AppHeader;
  }

  interface HTMLElementEventMap {
    'sign-out': CustomEvent<void>;
  }
}
