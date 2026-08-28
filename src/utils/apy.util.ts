import { BigNumber } from 'bignumber.js';

const APY_DECIMALS = 2;

export const formatApyPercent = (value: BigNumber.Value) =>
  new BigNumber(value).decimalPlaces(APY_DECIMALS).toFixed(APY_DECIMALS);
