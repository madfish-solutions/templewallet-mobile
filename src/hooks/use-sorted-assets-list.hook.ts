import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { TokenInterface } from '../token/interfaces/token.interface';
import { isDefined } from '../utils/is-defined';
import { mutezToTz } from '../utils/tezos.util';

const zero = new BigNumber(0);

export const useSortedAssetsList = (filteredAssetsList: TokenInterface[]) =>
  useMemo(
    () =>
      [...filteredAssetsList].sort((asset1, asset2) => {
        const parsedAmount1 = mutezToTz(new BigNumber(asset1.balance), asset1.decimals);
        const parsedAmount2 = mutezToTz(new BigNumber(asset2.balance), asset2.decimals);

        const dollarAmount1 = isDefined(asset1.exchangeRate) ? parsedAmount1.multipliedBy(asset1.exchangeRate) : zero;
        const dollarAmount2 = isDefined(asset2.exchangeRate) ? parsedAmount2.multipliedBy(asset2.exchangeRate) : zero;

        return dollarAmount2.minus(dollarAmount1).toNumber();
      }),
    [filteredAssetsList]
  );
