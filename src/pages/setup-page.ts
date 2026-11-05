import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '../components/card/card.ts';
import '../components/icon/icon.ts';
import { baseStyles } from '../styles/shared.styles.ts';

/** Shown in development while the Firebase environment variables are missing. */
@customElement('app-setup-page')
export class AppSetupPage extends LitElement {
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
        inline-size: min(100%, 36rem);
      }

      .stack {
        display: grid;
        gap: var(--spacing-stack-md);
      }

      h1 {
        display: flex;
        align-items: center;
        gap: var(--spacing-inline-xs);
        margin: 0;
        color: var(--color-content-strong);
        font-size: var(--typography-title-sm-size);
        font-weight: var(--typography-title-weight);
      }

      p,
      ol {
        margin: 0;
        color: var(--color-content-subtle);
      }

      ol {
        display: grid;
        gap: var(--spacing-stack-xs);
        padding-inline-start: 1.25rem;
      }

      ul {
        margin: 0;
        padding: var(--spacing-inset-md);
        list-style: none;
        border-radius: var(--radius-control);
        background: var(--color-bg-muted);
      }

      code {
        font-family: var(--typography-font-family-code);
        font-size: var(--typography-body-sm-size);
        color: var(--color-content-default);
      }
    `,
  ];

  @property({ attribute: false }) missingKeys: string[] = [];

  override render() {
    return html`
      <app-card padding="xl">
        <div class="stack">
          <h1><app-icon name="settings"></app-icon> Configure o Firebase</h1>
          <p>O login com Google precisa destas variáveis de ambiente:</p>
          <ul>
            ${this.missingKeys.map((key) => html`<li><code>${key}</code></li>`)}
          </ul>
          <ol>
            <li>Copie <code>.env.example</code> para <code>.env.local</code>.</li>
            <li>Preencha com os dados do app web do seu projeto Firebase.</li>
            <li>Ative o provedor Google em Authentication → Sign-in method.</li>
            <li>Reinicie o <code>npm run dev</code>.</li>
          </ol>
        </div>
      </app-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-setup-page': AppSetupPage;
  }
}
