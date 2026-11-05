import { LitElement, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { icons, isIconName } from './icons.ts';

/**
 * Decorative by default (aria-hidden). Pass `label` to make the icon
 * meaningful for assistive technology.
 *
 * @example <app-icon name="sun"></app-icon>
 */
@customElement('app-icon')
export class AppIcon extends LitElement {
  static override styles = css`
    :host {
      display: inline-flex;
      inline-size: var(--app-icon-size, 1.25em);
      block-size: var(--app-icon-size, 1.25em);
      flex-shrink: 0;
      color: inherit;
    }

    svg {
      inline-size: 100%;
      block-size: 100%;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
  `;

  @property({ reflect: true }) name = '';
  @property() label: string | undefined;

  override render() {
    if (!isIconName(this.name)) return nothing;

    return html`<svg
      viewBox="0 0 24 24"
      role=${this.label ? 'img' : nothing}
      aria-label=${this.label ?? nothing}
      aria-hidden=${this.label ? nothing : 'true'}
      focusable="false"
    >
      ${icons[this.name]}
    </svg>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-icon': AppIcon;
  }
}
