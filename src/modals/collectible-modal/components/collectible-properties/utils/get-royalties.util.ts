import { isNonEmptyArray } from '@apollo/client/utilities';
import { BigNumber } from 'bignumber.js';

import { mutezToTz } from '../../../../../utils/tezos.util';

export const getRoyalties = (royalties: { amount: number; decimals: number }[]) => {
  if (!isNonEmptyArray(royalties)) {
    return null;
  }

  const royaltiesSum = royalties.reduce(
    (acc, { amount, decimals }) => acc + mutezToTz(new BigNumber(amount ?? 0), decimals).toNumber(),
    0
  );

  const result = `${royaltiesSum * 100}%`;

  return result;
};
