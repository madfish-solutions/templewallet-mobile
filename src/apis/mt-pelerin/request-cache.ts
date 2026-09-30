interface CachedRequest<T> {
  promise: Promise<T>;
  expiresAt: number;
}

export const getCachedMtPelerinRequest = <T>(
  cache: Map<string, CachedRequest<T>>,
  key: string,
  ttl: number,
  request: () => Promise<T>
): Promise<T> => {
  const cached = cache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.promise;
  }

  const promise = request();
  const entry = { promise, expiresAt: Infinity };
  if (cache.size >= 100) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey) {
      cache.delete(oldestKey);
    }
  }
  cache.set(key, entry);
  promise.then(
    () => {
      entry.expiresAt = Date.now() + ttl;
    },
    () => {
      if (cache.get(key) === entry) {
        cache.delete(key);
      }
    }
  );

  return promise;
};
