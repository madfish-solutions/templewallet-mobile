export const sliceIntoChunks = <T>(array: T[], chunkSize: number) => {
  const result = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
};

export const filterUnique = <T>(array: T[]) => Array.from(new Set(array));
