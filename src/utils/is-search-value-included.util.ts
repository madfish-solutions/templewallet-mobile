export const isSearchValueIncluded = (searchValue: string, ...args: Array<string>): boolean => {
  for (const value of args) {
    if (value.includes(searchValue)) {
      return true;
    }
  }

  return false;
};
