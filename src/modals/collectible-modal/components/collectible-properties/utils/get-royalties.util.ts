import { isNonEmptyArray } from '@apollo/client/utilities';
import { BigNumber } from 'bignumber.js';

import { mutezToTz } from 'src/utils/tezos.util';

export const getRoyalties = (royalties: { amount: number; decimals: number }[]) => {
  if (!isNonEmptyArray(royalties)) {
    return null;
  }

  let royaltiesSum = royalties.reduce(
    (acc, { amount, decimals }) => acc + mutezToTz(new BigNumber(amount ?? 0), decimals).toNumber(),
    0
  );

  if (royaltiesSum % 1 !== 0) {
    royaltiesSum = Number(royaltiesSum.toFixed(2));
  }

  const result = `${royaltiesSum * 100}%`;

  return result;
};
