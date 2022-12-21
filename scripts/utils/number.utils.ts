import { BigNumber } from 'bignumber.js';

export const mutezToTz = (mutezAmount: BigNumber, decimals: number): BigNumber => {
  return mutezAmount.integerValue().div(new BigNumber(10).pow(decimals));
};
