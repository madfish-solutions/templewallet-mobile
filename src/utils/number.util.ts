import { BigNumber } from 'bignumber.js';
import { isNaN } from 'lodash-es';

import { isDefined } from './is-defined';

export const formatAssetAmount = (
  amount: BigNumber | undefined,
  roundingMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN,
  decimalPlace = 6
) => {
  if (isDefined(amount) && isNaN(amount.toNumber())) {
    return '';
  }
  if (isDefined(amount)) {
    return amount.decimalPlaces(amount.abs().lt(1000) ? decimalPlace : 2, roundingMode).toFixed();
  }

  return '';
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

const numberWithSpaces = (amount: string) => {
  const parts = amount.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return parts.join('.');
};
