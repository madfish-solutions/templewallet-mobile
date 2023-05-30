export const sliceIntoChunks = <T>(array: T[], chunkSize: number) => {
  const result = [];

  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
};

export const filterByStringProperty = <T extends { [key in K]: string }, K extends string>(array: T[], key: K): T[] => {
  const usedKeyValues: string[] = [];

  return array.filter(item => {
    const val = item[key];
    if (usedKeyValues.includes(val)) {
      return false;
    }

    usedKeyValues.push(val);

    return true;
  });
};
