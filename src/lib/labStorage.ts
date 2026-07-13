/** Read a JSON object persisted in localStorage (SSR-safe). */
export function readLabStorageRecord<T>(storageKey: string): T {
  if (typeof window === "undefined") return {} as T;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? (JSON.parse(raw) as T) : ({} as T);
  } catch {
    return {} as T;
  }
}

/** Write a JSON object to localStorage (SSR-safe). */
export function writeLabStorageRecord<T>(storageKey: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(value));
  } catch {
    // Ignore quota / private mode errors.
  }
}

export function labScopedKey(labId: number, suffix: string) {
  return `${labId}:${suffix}`;
}
