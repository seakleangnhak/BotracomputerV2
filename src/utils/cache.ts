type CacheEntry<T> = {
  value: T;
  expiresAt: number;
};

const FIFTEEN_MINUTES_MS = 15 * 60 * 1000;

const createMemoryCache = () => {
  const store = new Map<string, CacheEntry<unknown>>();

  return {
    get<T>(key: string) {
      const entry = store.get(key);

      if (!entry) {
        return null;
      }

      if (Date.now() >= entry.expiresAt) {
        store.delete(key);
        return null;
      }

      return entry.value as T;
    },
    set<T>(key: string, value: T, ttlMs = FIFTEEN_MINUTES_MS) {
      store.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
      });
    },
    delete(key: string) {
      store.delete(key);
    },
  };
};

declare global {
  // eslint-disable-next-line no-var
  var __botraMemoryCache: ReturnType<typeof createMemoryCache> | undefined;
}

const memoryCache =
  globalThis.__botraMemoryCache ?? (globalThis.__botraMemoryCache = createMemoryCache());

export const cacheGet = <T>(key: string) => memoryCache.get<T>(key);
export const cacheSet = <T>(key: string, value: T, ttlMs?: number) =>
  memoryCache.set<T>(key, value, ttlMs);
export const cacheDelete = (key: string) => memoryCache.delete(key);

export const DEFAULT_CACHE_TTL_MS = FIFTEEN_MINUTES_MS;

