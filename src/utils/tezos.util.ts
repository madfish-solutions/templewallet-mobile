import { BigNumber } from 'bignumber.js';

export const mutezToTz = (bigNum: BigNumber) => {
  if (bigNum.isNaN()) {
    return bigNum;
  }

  return bigNum.integerValue().div(10 ** 6);
};
