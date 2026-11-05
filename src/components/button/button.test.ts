import { describe, expect, it } from 'vitest';

import { mount } from '../../test/render.ts';
import type { AppButton } from './button.ts';
import './button.ts';

function nativeButton(element: AppButton): HTMLButtonElement {
  const button = element.shadowRoot?.querySelector('button');
  if (!button) throw new Error('native button not rendered');
  return button;
}

describe('app-button', () => {
  it('renders a native button with primary/md defaults', async () => {
    const element = await mount<AppButton>('<app-button>Salvar</app-button>');

    expect(element.variant).toBe('primary');
    expect(element.size).toBe('md');
    expect(element.getAttribute('variant')).toBe('primary');
    expect(nativeButton(element).type).toBe('button');
    expect(element.textContent.trim()).toBe('Salvar');
  });

  it('reflects the variant attribute', async () => {
    const element = await mount<AppButton>('<app-button variant="ghost">Cancelar</app-button>');

    expect(element.variant).toBe('ghost');
  });

  it('disables the native button when disabled', async () => {
    const element = await mount<AppButton>('<app-button disabled>Salvar</app-button>');

    expect(nativeButton(element).disabled).toBe(true);
  });

  it('marks itself busy and disabled while loading', async () => {
    const element = await mount<AppButton>('<app-button>Salvar</app-button>');
    element.loading = true;
    await element.updateComplete;

    const button = nativeButton(element);
    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(element.shadowRoot?.querySelector('.spinner')).not.toBeNull();
  });

  it('forwards the label as the accessible name', async () => {
    const element = await mount<AppButton>('<app-button icon-only label="Fechar"></app-button>');

    expect(nativeButton(element).getAttribute('aria-label')).toBe('Fechar');
  });
});
