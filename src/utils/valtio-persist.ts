import { proxy, subscribe } from "valtio";

export function createPersistedStore<T extends object>(
  initialState: T,
  key: string,
  options?: {
    deserializer?: (data: string) => T;
    serializer?: (data: T) => string;
  },
) {
  const { deserializer = JSON.parse, serializer = JSON.stringify } =
    options || {};

  const store = proxy(initialState);

  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(key);

    if (saved) {
      try {
        const data = deserializer(saved);

        // Guard against null/undefined
        if (data && typeof data === "object") {
          for (const k in data) {
            if (Object.prototype.hasOwnProperty.call(data, k)) {
              store[k as keyof T] = data[k as keyof T];
            }
          }
        }
      } catch (e) {
        console.error(`Failed to hydrate ${key}:`, e);
      }
    }

    // Subscribe to changes
    subscribe(store, () => {
      localStorage.setItem(key, serializer(store));
    });
  }

  return store;
}
