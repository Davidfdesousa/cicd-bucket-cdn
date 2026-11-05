import { LitElement, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { baseStyles } from '../../styles/shared.styles.ts';
import { buttonStyles } from './button.styles.ts';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonSize = 'sm' | 'md';

/**
 * @slot - Button text.
 * @slot icon-start - Optional leading icon.
 * @csspart control - The native <button>.
 *
 * @example
 * <app-button variant="secondary" @click=${handler}>Cancelar</app-button>
 */
@customElement('app-button')
export class AppButton extends LitElement {
  static override shadowRootOptions = { ...LitElement.shadowRootOptions, delegatesFocus: true };
  static override styles = [baseStyles, buttonStyles];

  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ reflect: true }) size: ButtonSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, reflect: true, attribute: 'full-width' }) fullWidth = false;
  @property({ type: Boolean, reflect: true, attribute: 'icon-only' }) iconOnly = false;

  /** Accessible name. Required when `icon-only` is set, since there is no visible text. */
  @property() label: string | undefined;

  override render() {
    return html`
      <button
        part="control"
        type="button"
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : nothing}
        aria-label=${this.label ?? nothing}
      >
        ${
          this.loading
            ? html`<span class="spinner" aria-hidden="true"></span>`
            : html`<slot name="icon-start"></slot>`
        }
        <slot></slot>
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-button': AppButton;
  }
}
