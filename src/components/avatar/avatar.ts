import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { baseStyles } from '../../styles/shared.styles.ts';

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '';
  return (first + last).toUpperCase() || '?';
}

/**
 * Shows the user's photo, falling back to initials when there is no photo
 * or it fails to load.
 */
@customElement('app-avatar')
export class AppAvatar extends LitElement {
  static override styles = [
    baseStyles,
    css`
      :host {
        --_size: var(--app-avatar-size, 2.25rem);

        display: inline-grid;
        place-items: center;
        inline-size: var(--_size);
        block-size: var(--_size);
        flex-shrink: 0;
        overflow: hidden;
        border-radius: var(--radius-full);
        background: var(--color-bg-brand-subtle);
        color: var(--color-content-brand);
        font-size: calc(var(--_size) * 0.4);
        font-weight: var(--font-weight-semibold);
      }

      img {
        inline-size: 100%;
        block-size: 100%;
        object-fit: cover;
      }
    `,
  ];

  @property() name = '';
  @property() src: string | undefined;

  @state() private failed = false;

  override willUpdate(changed: Map<PropertyKey, unknown>): void {
    if (changed.has('src')) this.failed = false;
  }

  override render() {
    if (this.src && !this.failed) {
      return html`<img
        src=${this.src}
        alt=${this.name}
        referrerpolicy="no-referrer"
        @error=${() => (this.failed = true)}
      />`;
    }

    return html`<span role="img" aria-label=${this.name}>${getInitials(this.name)}</span>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-avatar': AppAvatar;
  }
}
