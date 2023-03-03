import { BigNumber } from 'bignumber.js';
import { isNaN } from 'lodash-es';

export const formatOrdinalNumber = (n: number) => {
  if (isNaN(n)) {
    return '';
  }

  const j = n % 10;
  const k = n % 100;

  if (j === 1 && k !== 11) {
    return n + 'st';
  }
  if (j === 2 && k !== 12) {
    return n + 'nd';
  }
  if (j === 3 && k !== 13) {
    return n + 'rd';
  }

  return n + 'th';
};

export const formatToPercentStr = (value: number | BigNumber, zeroIsInvalid = true): string | undefined => {
  if (value instanceof BigNumber) {
    if (!value.isFinite() || (zeroIsInvalid && value.isZero())) {
      return;
    }

    return value.times(100).toFixed(2);
  }

  if (!Number.isFinite(value) || (zeroIsInvalid && value === 0)) {
    return;
  }

  return (value * 100).toFixed(2);
};
