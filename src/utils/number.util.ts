import { BigNumber } from 'bignumber.js';

export const formatAssetAmount = (amount: BigNumber) =>
  amount.decimalPlaces(amount.abs().lt(1000) ? 6 : 2, BigNumber.ROUND_DOWN).toFixed();
