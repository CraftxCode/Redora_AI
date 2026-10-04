import { normalizePollinationsKey } from '@/domain/ai/pollinationsKey';

/**
 * Browser-local store for an optional, user-supplied Pollinations key.
 * It never ships in the bundle and is only attached to requests sent to this app's own server.
 */
const STORAGE_KEY = 'redora.pollinations.key';
const CHANGE_EVENT = 'redora:pollinations-key-change';

const storage = (): Storage | null => {
  try { return window.localStorage; } catch { return null; }
};

export function getPollinationsKey(): string | null {
  try {
    return normalizePollinationsKey(storage()?.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
}

/** Returns false when the key is malformed or the browser refuses to store it. */
export function savePollinationsKey(input: string): boolean {
  const key = normalizePollinationsKey(input);
  const store = storage();
  if (!key || !store) return false;
  try {
    store.setItem(STORAGE_KEY, key);
  } catch {
    return false;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return true;
}

export function clearPollinationsKey(): void {
  try { storage()?.removeItem(STORAGE_KEY); } catch { /* storage unavailable: nothing to clear */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribePollinationsKey(notify: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, notify);
  window.addEventListener('storage', notify);
  return () => {
    window.removeEventListener(CHANGE_EVENT, notify);
    window.removeEventListener('storage', notify);
  };
}
