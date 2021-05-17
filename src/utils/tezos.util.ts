import { BigNumber } from 'bignumber.js';

export const mutezToTz = (bigNum: BigNumber, decimals: number) => {
  if (bigNum.isNaN()) {
    return bigNum;
  }

  return bigNum.integerValue().div(10 ** decimals);
};
