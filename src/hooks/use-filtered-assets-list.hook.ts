import { BigNumber } from 'bignumber.js';
import { useEffect, useState } from 'react';

import { useExchangeRatesSelector } from '../store/currency/currency-selectors';
import { TokenInterface } from '../token/interfaces/token.interface';
import { getTokenSlug } from '../token/utils/token.utils';
import { isDefined } from '../utils/is-defined';
import { isString } from '../utils/is-string';
import { isNonZeroBalance, mutezToTz } from '../utils/tezos.util';

export const useFilteredAssetsList = (assetsList: TokenInterface[], initialIsHideZeroBalance = false) => {
  const exchangeRates = useExchangeRatesSelector();

  const [isHideZeroBalance, setIsHideZeroBalance] = useState(initialIsHideZeroBalance);
  const [nonZeroBalanceAssetsList, setNonZeroBalanceAssetsList] = useState<TokenInterface[]>([]);

  const [searchValue, setSearchValue] = useState<string>();
  const [filteredAssetsList, setFilteredAssetsList] = useState<TokenInterface[]>([]);

  useEffect(() => {
    assetsList.sort((asset1, asset2) => {
      const zero = new BigNumber(0);

      const exchangeRate1: number | undefined = exchangeRates[getTokenSlug(asset1)];
      const exchangeRate2: number | undefined = exchangeRates[getTokenSlug(asset2)];

      const parsedAmount1 = mutezToTz(new BigNumber(asset1.balance), asset1.decimals);
      const parsedAmount2 = mutezToTz(new BigNumber(asset2.balance), asset2.decimals);

      const dollarAmount1 = isDefined(exchangeRate1) ? parsedAmount1.multipliedBy(exchangeRate1) : zero;
      const dollarAmount2 = isDefined(exchangeRate2) ? parsedAmount2.multipliedBy(exchangeRate2) : zero;

      return dollarAmount2.minus(dollarAmount1).toNumber();
    });
  }, [assetsList]);

  useEffect(() => {
    const result: TokenInterface[] = assetsList.filter(asset => isNonZeroBalance(asset));

    setNonZeroBalanceAssetsList(result);
  }, [assetsList]);

  useEffect(() => {
    const sourceArray = isHideZeroBalance ? nonZeroBalanceAssetsList : assetsList;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TokenInterface[] = [];

      for (const asset of sourceArray) {
        const { name, symbol, address } = asset;

        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          symbol.toLowerCase().includes(lowerCaseSearchValue) ||
          address.toLowerCase().includes(lowerCaseSearchValue)
        ) {
          result.push(asset);
        }
      }

      setFilteredAssetsList(result);
    } else {
      setFilteredAssetsList(sourceArray);
    }
  }, [isHideZeroBalance, searchValue, assetsList, nonZeroBalanceAssetsList]);

  return {
    filteredAssetsList,
    isHideZeroBalance,
    setIsHideZeroBalance,
    searchValue,
    setSearchValue
  };
};
