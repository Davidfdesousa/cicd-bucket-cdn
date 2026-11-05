export type Theme = 'light' | 'dark';

export const themeStorageKey = 'app:theme';

function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark';
}

export function readStoredTheme(storage: Pick<Storage, 'getItem'> = localStorage): Theme | null {
  try {
    const value = storage.getItem(themeStorageKey);
    return isTheme(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: Theme, storage: Pick<Storage, 'setItem'> = localStorage): void {
  try {
    storage.setItem(themeStorageKey, theme);
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The theme still applies for this visit.
  }
}

export function getSystemTheme(): Theme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** The theme currently in effect: the explicit choice on <html>, otherwise the OS preference. */
export function getActiveTheme(root: HTMLElement = document.documentElement): Theme {
  const explicit = root.dataset.theme;
  return isTheme(explicit) ? explicit : getSystemTheme();
}

/**
 * Forces a theme on <html>. Without an explicit theme the page follows the OS.
 * The saved choice is restored before first paint by an inline script in index.html,
 * which must use the same storage key as `themeStorageKey`.
 */
export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  root.dataset.theme = theme;
}
