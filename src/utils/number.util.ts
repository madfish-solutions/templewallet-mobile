import { BigNumber } from 'bignumber.js';
import { isNaN } from 'lodash-es';

export const formatAssetAmount = (amount: BigNumber, decimalPlace = 6) => {
  if (isNaN(amount.toNumber())) {
    return '';
  }

  const minDisplayedAmount = new BigNumber(`0.${'0'.repeat(decimalPlace - 1)}1`);

  if (
    amount.isLessThan(minDisplayedAmount) &&
    amount.isGreaterThan(minDisplayedAmount.multipliedBy(-1)) &&
    !amount.isZero()
  ) {
    return amount.isNegative() ? `< -${minDisplayedAmount}` : `< ${minDisplayedAmount}`;
  } else {
    return numberWithSpaces(
      amount.decimalPlaces(amount.abs().lt(1000) ? decimalPlace : 2, BigNumber.ROUND_DOWN).toFixed()
    );
  }
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
