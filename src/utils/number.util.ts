import { BigNumber } from 'bignumber.js';
import { isNaN } from 'lodash-es';

export const formatAssetAmount = (amount: BigNumber, decimalPlace = 6) => {
  if (isNaN(amount.toNumber())) {
    return '';
  }

  return amount.decimalPlaces(amount.abs().lt(1000) ? decimalPlace : 2, BigNumber.ROUND_DOWN).toFixed();
};

export const roundFiat = (
  amount: BigNumber,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN
): BigNumber => {
  if (amount.isNaN()) {
    return new BigNumber(0);
  }

  return amount.decimalPlaces(2, roundingMode);
};

export const invertSign = (amount: string) => new BigNumber(amount).times(-1).toString();

export const kFormatter = (num: number): string | number => {
  if (isNaN(num)) {
    return '';
  }

  return (Math.sign(num) * Math.round(Math.abs(num) / 1000)).toLocaleString() + ' K';
};
