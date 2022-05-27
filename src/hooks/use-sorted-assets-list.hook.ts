import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { useUsdToTokenRates } from '../store/currency/currency-selectors';
import { TokenInterface } from '../token/interfaces/token.interface';
import { getTokenSlug } from '../token/utils/token.utils';
import { isDefined } from '../utils/is-defined';
import { mutezToTz } from '../utils/tezos.util';

export const useSortedAssetsList = (filteredAssetsList: TokenInterface[]) => {
  const exchangeRates = useUsdToTokenRates();

  return useMemo(
    () =>
      [...filteredAssetsList].sort((asset1, asset2) => {
        const zero = new BigNumber(0);

        const exchangeRate1: number | undefined = exchangeRates[getTokenSlug(asset1)];
        const exchangeRate2: number | undefined = exchangeRates[getTokenSlug(asset2)];

        const parsedAmount1 = mutezToTz(new BigNumber(asset1.balance), asset1.decimals);
        const parsedAmount2 = mutezToTz(new BigNumber(asset2.balance), asset2.decimals);

        const dollarAmount1 = isDefined(exchangeRate1) ? parsedAmount1.multipliedBy(exchangeRate1) : zero;
        const dollarAmount2 = isDefined(exchangeRate2) ? parsedAmount2.multipliedBy(exchangeRate2) : zero;

        return dollarAmount2.minus(dollarAmount1).toNumber();
      }),
    [filteredAssetsList]
  );
};
