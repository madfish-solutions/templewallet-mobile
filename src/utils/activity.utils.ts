import { BigNumber } from 'bignumber.js';

import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';

import { isDefined } from './is-defined';

export const isSingleTokenOperation = (amounts: Array<ActivityAmount>) => amounts.length === 1;

export const isDoubleTokenOperation = (amounts: Array<ActivityAmount>) => amounts.length === 2;

const ZERO = new BigNumber(0);

export const calculateDollarValue = (amounts: Array<ActivityAmount>) =>
  amounts.reduce((accum, curr) => {
    if (isDefined(curr.fiatAmount)) {
      return accum.plus(curr.fiatAmount);
    }

    return accum;
  }, ZERO);
