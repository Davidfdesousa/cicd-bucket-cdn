import { describe, expect, it, vi } from 'vitest';

import { createStore } from './store.ts';

describe('createStore', () => {
  it('emits the current value on subscribe and every change after', () => {
    const store = createStore(1);
    const listener = vi.fn();

    store.subscribe(listener);
    store.set(2);

    expect(listener.mock.calls).toEqual([[1], [2]]);
    expect(store.get()).toBe(2);
  });

  it('stops emitting after unsubscribe', () => {
    const store = createStore('a');
    const listener = vi.fn();

    const unsubscribe = store.subscribe(listener);
    unsubscribe();
    store.set('b');

    expect(listener).toHaveBeenCalledTimes(1);
  });
});
