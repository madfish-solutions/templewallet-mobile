import { BigNumber } from 'bignumber.js';

export const formatAssetAmount = (
  amount: BigNumber,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
  decimalPlace = 6
) => {
  return amount.decimalPlaces(amount.abs().lt(1000) ? decimalPlace : 2, roundingMode).toFixed();
};
