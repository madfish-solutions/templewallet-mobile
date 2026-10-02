const getErrorId = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    for (let index = value.length - 1; index >= 0; index--) {
      const id = getErrorId(value[index]);

      if (id) {
        return id;
      }
    }

    return undefined;
  }

  if (typeof value !== 'object' || value === null) {
    return undefined;
  }

  if ('errors' in value) {
    const id = getErrorId(value.errors);

    if (id) {
      return id;
    }
  }

  if ('error' in value) {
    const id = getErrorId(value.error);

    if (id) {
      return id;
    }
  }

  if ('id' in value && typeof value.id === 'string') {
    return value.id.split('.').at(-1);
  }

  return undefined;
};

export const getTezosRpcErrorId = (error: unknown): string | undefined => {
  const id = getErrorId(error);

  if (id || typeof error !== 'object' || error === null || !('body' in error) || typeof error.body !== 'string') {
    return id;
  }

  try {
    return getErrorId(JSON.parse(error.body));
  } catch {
    return undefined;
  }
};
