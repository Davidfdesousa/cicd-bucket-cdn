import { afterEach } from 'vitest';

afterEach(() => {
  document.body.innerHTML = '';
  delete document.documentElement.dataset.theme;
  localStorage.clear();
});
