import { describe, expect, it } from 'vitest';

import { applyTheme, getActiveTheme, readStoredTheme, storeTheme, themeStorageKey } from './theme.ts';

describe('theme', () => {
  it('persists and reads back a valid theme', () => {
    storeTheme('dark');

    expect(localStorage.getItem(themeStorageKey)).toBe('dark');
    expect(readStoredTheme()).toBe('dark');
  });

  it('ignores invalid stored values', () => {
    localStorage.setItem(themeStorageKey, 'sepia');

    expect(readStoredTheme()).toBeNull();
  });

  it('survives unavailable storage', () => {
    const throwingStorage = {
      getItem: () => {
        throw new Error('blocked');
      },
    };

    expect(readStoredTheme(throwingStorage)).toBeNull();
  });

  it('prefers the explicit theme on <html>', () => {
    applyTheme('dark');

    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(getActiveTheme()).toBe('dark');
  });
});
