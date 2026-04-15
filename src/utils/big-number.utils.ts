import BigNumber from 'bignumber.js';

const bigIntMax = (...args: BigNumber[]) => args.reduce((m, e) => (e.isGreaterThan(m) ? e : m));
const bigIntMin = (...args: BigNumber[]) => args.reduce((m, e) => (e.isLessThan(m) ? e : m));

export const bigIntClamp = (number: BigNumber, lower: BigNumber, upper: BigNumber) => {
  const lowerClampedValue = bigIntMax(number, lower);

  return bigIntMin(lowerClampedValue, upper);
};
