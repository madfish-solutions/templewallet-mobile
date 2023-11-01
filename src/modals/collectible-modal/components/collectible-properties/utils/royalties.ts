import { BigNumber } from 'bignumber.js';

import { ObjktRoyalty } from 'src/apis/objkt/types';
import { fractionToPercentage } from 'src/utils/percentage.utils';
import { mutezToTz } from 'src/utils/tezos.util';

export const reduceRoyalties = (royalties: ObjktRoyalty[]) => {
  if (!royalties) {
    return null;
  }

  const royaltiesSum = royalties.reduce(
    (acc, { amount, decimals }) => acc.plus(mutezToTz(new BigNumber(amount), decimals)),
    new BigNumber(0)
  );

  return `${fractionToPercentage(royaltiesSum).decimalPlaces(2)}%`;
};
