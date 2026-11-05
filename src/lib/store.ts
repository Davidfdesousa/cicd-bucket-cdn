export type StoreListener<T> = (value: T) => void;

export interface Store<T> {
  get: () => T;
  set: (value: T) => void;
  subscribe: (listener: StoreListener<T>) => () => void;
}

/**
 * Minimal observable store. Listeners are called immediately with the
 * current value on subscribe and on every subsequent `set`.
 */
export function createStore<T>(initialValue: T): Store<T> {
  let value = initialValue;
  const listeners = new Set<StoreListener<T>>();

  return {
    get: () => value,
    set: (nextValue) => {
      value = nextValue;
      for (const listener of listeners) listener(value);
    },
    subscribe: (listener) => {
      listeners.add(listener);
      listener(value);
      return () => listeners.delete(listener);
    },
  };
}
