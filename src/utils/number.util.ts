import { BigNumber } from 'bignumber.js';
import { isNaN } from 'lodash-es';

export const formatAssetAmount = (
  amount: BigNumber,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
  decimalPlace = 6
<<<<<<< HEAD
) => amount.decimalPlaces(amount.abs().lt(1000) ? decimalPlace : 2, roundingMode).toFixed();

export const invertSign = (amount: string) => new BigNumber(amount).times(-1).toString();

export const kFormatter = (num: number): string =>
  (Math.sign(num) * Math.round(Math.abs(num) / 1000)).toLocaleString() + ' K';
=======
) => {
  if (isNaN(amount.toNumber())) {
    return '';
  }

  return amount.decimalPlaces(amount.abs().lt(1000) ? decimalPlace : 2, roundingMode).toFixed();
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
>>>>>>> 4a8b805355b38151b514090b8ba56443d278f585
