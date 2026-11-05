import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { baseStyles } from '../../styles/shared.styles.ts';

export type CardPadding = 'md' | 'lg' | 'xl';

/**
 * Elevated surface for grouping content.
 *
 * @slot - Card content.
 */
@customElement('app-card')
export class AppCard extends LitElement {
  static override styles = [
    baseStyles,
    css`
      :host {
        display: block;
        padding: var(--spacing-inset-lg);
        border: 1px solid var(--color-border-default);
        border-radius: var(--radius-surface);
        background: var(--color-bg-default);
        box-shadow: var(--shadow-sm);
      }

      :host([padding='md']) {
        padding: var(--spacing-inset-md);
      }

      :host([padding='xl']) {
        padding: var(--spacing-inset-xl);
      }
    `,
  ];

  @property({ reflect: true }) padding: CardPadding = 'lg';

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-card': AppCard;
  }
}
