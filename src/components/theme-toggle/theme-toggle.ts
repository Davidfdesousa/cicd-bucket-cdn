import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import { applyTheme, getActiveTheme, storeTheme, type Theme } from '../../lib/theme.ts';
import '../button/button.ts';
import '../icon/icon.ts';

/** Switches between light and dark themes and remembers the choice. */
@customElement('app-theme-toggle')
export class AppThemeToggle extends LitElement {
  @state() private theme: Theme = getActiveTheme();

  private toggle(): void {
    const next: Theme = this.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storeTheme(next);
    this.theme = next;
  }

  override render() {
    const isDark = this.theme === 'dark';
    const label = isDark ? 'Ativar tema claro' : 'Ativar tema escuro';

    return html`
      <app-button variant="ghost" icon-only label=${label} title=${label} @click=${this.toggle}>
        <app-icon name=${isDark ? 'sun' : 'moon'}></app-icon>
      </app-button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-theme-toggle': AppThemeToggle;
  }
}
