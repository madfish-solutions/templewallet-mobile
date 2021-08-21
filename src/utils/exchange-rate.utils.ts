import { BigNumber } from 'bignumber.js';

import { isDefined } from './is-defined';

export const tokenToUsd = (amount: BigNumber.Value, exchangeRate?: number) => {
  if (isDefined(exchangeRate)) {
    return new BigNumber(amount).times(exchangeRate).decimalPlaces(2, BigNumber.ROUND_DOWN);
  }

  return new BigNumber(NaN);
};

export const usdToToken = (amount: BigNumber.Value, tokenDecimals: number, exchangeRate?: number) => {
  if (isDefined(exchangeRate) && exchangeRate !== 0) {
    return new BigNumber(amount).div(exchangeRate).decimalPlaces(tokenDecimals, BigNumber.ROUND_DOWN);
  }

  return new BigNumber(NaN);
};
