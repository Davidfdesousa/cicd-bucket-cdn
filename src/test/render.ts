import type { LitElement } from 'lit';

/** Mounts a custom element from markup and waits for its first render. */
export async function mount<T extends LitElement>(markup: string): Promise<T> {
  const container = document.createElement('div');
  container.innerHTML = markup;
  document.body.append(container);

  const element = container.firstElementChild as T;
  await element.updateComplete;
  return element;
}
