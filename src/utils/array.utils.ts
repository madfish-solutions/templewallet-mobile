export const getLastElement = <T>(array: Array<T>): T | undefined => array[array.length - 1];

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
