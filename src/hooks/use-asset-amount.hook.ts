import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { isDefined } from 'src/utils/is-defined';
import { mutezToTz } from 'src/utils/tezos.util';

export const useAssetAmount = (
  atomicAmount: BigNumber.Value,
  decimals: number,
  toUsdExchangeRate: BigNumber.Value | nullish
) => {
  const assetAmount = useMemo(() => mutezToTz(new BigNumber(atomicAmount), decimals), [atomicAmount, decimals]);

  const usdEquivalent = useMemo(
    () => (isDefined(toUsdExchangeRate) ? assetAmount.times(toUsdExchangeRate) : undefined),
    [assetAmount, toUsdExchangeRate]
  );

  return { assetAmount, usdEquivalent };
};
