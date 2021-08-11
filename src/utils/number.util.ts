import { BigNumber } from 'bignumber.js';

export const formatAssetAmount = (
  amount: BigNumber,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
  decimalPlace = 6
) => {
  if (isNaN(amount.toNumber())) {
    return NaN;
  }

  return amount.decimalPlaces(amount.abs().lt(1000) ? decimalPlace : 2, roundingMode).toFixed();
};

export const roundFiat = (amount: BigNumber, roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN) =>
  amount.decimalPlaces(2, roundingMode);

export const invertSign = (amount: string) => new BigNumber(amount).times(-1).toString();

export const kFormatter = (num: number): string =>
  (Math.sign(num) * Math.round(Math.abs(num) / 1000)).toLocaleString() + ' K';
