export const sumFields = <K extends string, T extends Record<K, number>>(
  item: T,
  positiveSummands: K[],
  negativeSummands: K[]
) => {
  return (
    positiveSummands.reduce((sum, key) => sum + item[key], 0) -
    negativeSummands.reduce((sum, key) => sum + item[key], 0)
  );
};
