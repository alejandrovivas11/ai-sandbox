import "@testing-library/jest-dom";

// Polyfill localStorage for Node.js v22+ where the built-in
// localStorage requires --localstorage-file and lacks full API support.
const store: Record<string, string> = {};
const localStorageMock: Storage = {
  getItem(key: string): string | null {
    return key in store ? store[key] : null;
  },
  setItem(key: string, value: string): void {
    store[key] = String(value);
  },
  removeItem(key: string): void {
    delete store[key];
  },
  clear(): void {
    for (const key of Object.keys(store)) {
      delete store[key];
    }
  },
  get length(): number {
    return Object.keys(store).length;
  },
  key(index: number): string | null {
    const keys = Object.keys(store);
    return keys[index] ?? null;
  },
};

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
  writable: true,
  configurable: true,
});
