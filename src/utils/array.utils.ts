export const sliceIntoChunks = <T>(array: T[], chunkSize: number) => {
  const result = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
};

export const deduplicate = <T>(arr: T[], filterPredicate: (a: T, b: T) => boolean) =>
  arr.filter((value, index, self) => index === self.findIndex(t => filterPredicate(t, value)));
