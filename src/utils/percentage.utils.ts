import { BigNumber } from 'bignumber.js';

export const fractionToPercentage = (value: BigNumber.Value) => new BigNumber(value).times(100);

export const percentageToFraction = (value: BigNumber.Value) => new BigNumber(value).dividedBy(100);
