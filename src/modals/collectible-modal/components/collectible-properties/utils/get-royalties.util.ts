import { isNonEmptyArray } from '@apollo/client/utilities';
import { BigNumber } from 'bignumber.js';

export const getRoyalties = (royalties: { amount: number; decimals: number }[]) => {
  if (!isNonEmptyArray(royalties)) {
    return null;
  }

  const { amount, decimals } = royalties[0];

  const amountBN = new BigNumber(amount ?? 0);

  const result = `${Number(amountBN.dividedBy(10 ** decimals).multipliedBy(100))}%`;

  return result;
};
