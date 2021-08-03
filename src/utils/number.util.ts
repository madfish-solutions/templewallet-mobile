import { BigNumber } from 'bignumber.js';

export const formatAssetAmount = (
  amount: BigNumber,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
  decimalPlace = 6
) => amount.decimalPlaces(amount.abs().lt(1000) ? decimalPlace : 2, roundingMode).toFixed();

export const kFormatter = (num: number): string =>
  (Math.sign(num) * Math.round(Math.abs(num) / 1000)).toLocaleString() + ' K';
