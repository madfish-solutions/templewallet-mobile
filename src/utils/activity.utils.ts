import { BigNumber } from 'bignumber.js';
import { isEmpty } from 'lodash-es';

import { ActivityAmount } from 'src/interfaces/non-zero-amounts.interface';

import { isDefined } from './is-defined';

export const isSingleTokenOperation = (amounts: Array<ActivityAmount>) => amounts.length === 1;

const ZERO = new BigNumber(0);

export const separateAmountsBySign = (nonZeroAmounts: Array<ActivityAmount>) => {
  const positiveAmounts: Array<ActivityAmount> = [];
  const negativeAmounts: Array<ActivityAmount> = [];

  for (const amount of nonZeroAmounts) {
    if (amount.isPositive) {
      positiveAmounts.push(amount);
    } else {
      negativeAmounts.push(amount);
    }
  }

  return { positiveAmounts, negativeAmounts };
};

export const calculateDollarValue = (amounts: Array<ActivityAmount>) => {
  const { positiveAmounts, negativeAmounts } = separateAmountsBySign(amounts);

  const source = isEmpty(positiveAmounts) ? negativeAmounts : positiveAmounts;

  return source.reduce((accum, curr) => {
    if (isDefined(curr.fiatAmount)) {
      return accum.plus(curr.fiatAmount);
    }

    return accum;
  }, ZERO);
};
