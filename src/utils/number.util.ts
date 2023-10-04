import { BigNumber } from 'bignumber.js';
import { isNaN } from 'lodash-es';

export const isPositiveNumber = <T extends BigNumber.Value>(value?: T): value is T =>
  value != null && new BigNumber(value).isGreaterThan(0);

export const formatAssetAmount = (amount: BigNumber, decimalPlace = 6, showAllDecimalPlaces = false) => {
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
    const decimalPlacesToShow = amount.abs().lt(1000) ? decimalPlace : 2;
    const roundedAmount = amount.decimalPlaces(decimalPlacesToShow, BigNumber.ROUND_DOWN);

    return numberWithSpaces(
      showAllDecimalPlaces ? roundedAmount.toFixed(decimalPlacesToShow) : roundedAmount.toFixed()
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

const THOUSAND = 1000;
const MILLION = 1000 * 1000;
const BILLION = 1000 * 1000 * 1000;
export const kFormatter = (num: number): string => {
  if (isNaN(num)) {
    return '';
  }

  const sign = Math.sign(num);

  const formattedValue = Math.abs(num);

  if (formattedValue >= BILLION) {
    return (sign * Math.round(formattedValue / BILLION)).toLocaleString() + 'B';
  }

  if (formattedValue >= MILLION) {
    return (sign * Math.round(formattedValue / MILLION)).toLocaleString() + 'M';
  }

  if (formattedValue >= THOUSAND) {
    return (sign * Math.round(formattedValue / THOUSAND)).toLocaleString() + 'K';
  }

  return (sign * formattedValue).toLocaleString();
};

const numberWithSpaces = (amount: string) => {
  const parts = amount.split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return parts.join('.');
};

export const ZERO = new BigNumber(0);
