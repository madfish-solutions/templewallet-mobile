export const putToCappedCache = <K, V>(map: Map<K, V>, key: K, value: V, maxSize: number) => {
  map.delete(key);
  map.set(key, value);

  while (map.size > maxSize) {
    const oldest = map.keys().next();

    if (oldest.done === true) {
      break;
    }

    map.delete(oldest.value);
  }
};
