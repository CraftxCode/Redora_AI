import type { TopicRef } from '@/domain/chat/contracts';
import { normalize } from '@/domain/knowledge/text';

export interface CachedAnswer { reply: string; topics: TopicRef[] }

export interface ResponseCache {
  get(message: string): CachedAnswer | null;
  set(message: string, value: CachedAnswer): void;
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>;
interface Stored { v: CachedAnswer; at: number }

/** Small TTL + size-bounded cache persisted to localStorage. Storage failures are non-fatal. */
export class StorageResponseCache implements ResponseCache {
  private map: Map<string, Stored> | null = null;

  constructor(
    private readonly storage: StorageLike | null,
    private readonly opts: { ttlMs?: number; maxEntries?: number; key?: string; now?: () => number } = {},
  ) {}

  private get ttl() { return this.opts.ttlMs ?? 24 * 60 * 60 * 1000; }
  private get max() { return this.opts.maxEntries ?? 50; }
  private get storageKey() { return this.opts.key ?? 'redora-ai:answers:v1'; }
  private now() { return (this.opts.now ?? Date.now)(); }

  private load(): Map<string, Stored> {
    if (this.map) return this.map;
    this.map = new Map();
    try {
      const raw = this.storage?.getItem(this.storageKey);
      if (raw) for (const [k, v] of Object.entries(JSON.parse(raw) as Record<string, Stored>)) this.map.set(k, v);
    } catch { /* ignore corrupt storage */ }
    return this.map;
  }

  get(message: string): CachedAnswer | null {
    const map = this.load();
    const key = normalize(message);
    const hit = map.get(key);
    if (!hit) return null;
    if (this.now() - hit.at > this.ttl) {
      map.delete(key);
      return null;
    }
    return hit.v;
  }

  set(message: string, value: CachedAnswer): void {
    const map = this.load();
    map.set(normalize(message), { v: value, at: this.now() });
    while (map.size > this.max) map.delete(map.keys().next().value as string);
    try {
      this.storage?.setItem(this.storageKey, JSON.stringify(Object.fromEntries(map)));
    } catch { /* quota or privacy mode — keep in memory only */ }
  }
}
