import { BigNumber } from 'bignumber.js';

//Math.max and Math.min analogs
const bigIntMax = (...args: BigNumber[]) => args.reduce((m, e) => (e > m ? e : m));
const bigIntMin = (...args: BigNumber[]) => args.reduce((m, e) => (e < m ? e : m));

export const bigIntClamp = (number: BigNumber, lower: BigNumber, upper: BigNumber) => {
  const lowerClampedValue = bigIntMax(number, lower);

  return bigIntMin(lowerClampedValue, upper);
};
