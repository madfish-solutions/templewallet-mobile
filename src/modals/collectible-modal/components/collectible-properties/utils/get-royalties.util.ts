import { isNonEmptyArray } from '@apollo/client/utilities';
import { BigNumber } from 'bignumber.js';

import { mutezToTz } from '../../../../../utils/tezos.util';

export const getRoyalties = (royalties: { amount: number; decimals: number }[]) => {
  if (!isNonEmptyArray(royalties)) {
    return null;
  }

  const { amount, decimals } = royalties[0];

  const amountBN = new BigNumber(amount ?? 0);

  const result = `${mutezToTz(amountBN, decimals).multipliedBy(100).toFixed()}%`;

  return result;
};
