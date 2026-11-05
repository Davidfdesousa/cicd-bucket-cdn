import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../components/card/card.ts';
import type { AuthUser } from '../services/auth/index.ts';
import { baseStyles } from '../styles/shared.styles.ts';

@customElement('app-home-page')
export class AppHomePage extends LitElement {
  static override styles = [
    baseStyles,
    css`
      :host {
        display: block;
        max-inline-size: var(--layout-content-max-width);
        margin-inline: auto;
        padding: var(--spacing-inset-lg) var(--spacing-inset-md);
      }

      .stack {
        display: grid;
        gap: var(--spacing-stack-lg);
      }

      h1 {
        margin: 0;
        color: var(--color-content-strong);
        font-size: var(--typography-title-lg-size);
        font-weight: var(--typography-title-weight);
        line-height: var(--typography-title-line-height);
      }

      h2 {
        margin: 0 0 var(--spacing-stack-xs);
        font-size: var(--typography-title-sm-size);
        font-weight: var(--typography-title-weight);
      }

      p {
        margin: 0;
        color: var(--color-content-subtle);
      }

      code {
        font-family: var(--typography-font-family-code);
        font-size: 0.9em;
        padding: 0.1em 0.35em;
        border-radius: var(--radius-sm);
        background: var(--color-bg-muted);
        color: var(--color-content-default);
      }
    `,
  ];

  @property({ attribute: false }) user: AuthUser | null = null;

  override render() {
    const firstName = this.user?.displayName?.split(' ')[0] ?? 'por aqui';

    return html`
      <div class="stack">
        <h1>Olá, ${firstName} 👋</h1>

        <app-card>
          <h2>Tudo pronto</h2>
          <p>
            Você está autenticado com o Google. Comece editando <code>src/pages/home-page.ts</code> e crie
            novos componentes em <code>src/components</code>.
          </p>
        </app-card>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-home-page': AppHomePage;
  }
}
