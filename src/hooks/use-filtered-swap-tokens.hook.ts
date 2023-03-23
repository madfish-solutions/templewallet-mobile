import { useMemo, useState } from 'react';

import { useSwapTokensSlugsSelector } from 'src/store/swap/swap-selectors';
import { useSelectedAccountTezosTokenSelector } from 'src/store/wallet/wallet-selectors';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { TokenInterface } from '../token/interfaces/token.interface';
import { isString } from '../utils/is-string';
import { isNonZeroBalance } from '../utils/tezos.util';

export const useFilteredSwapTokensList = (tokensList: TokenInterface[]) => {
  const swapTokensSlugs = useSwapTokensSlugsSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();

  const swapTokensListJoin = useMemo(
    () => [tezosToken, ...tokensList.filter(token => swapTokensSlugs.includes(toTokenSlug(token.address, token.id)))],
    [swapTokensSlugs]
  );
  const nonZeroBalanceTokensList = useMemo<TokenInterface[]>(
    () => swapTokensListJoin.filter(token => isNonZeroBalance(token)),
    [tokensList]
  );

  const [searchValue, setSearchValue] = useState<string>();
  const filteredTokensList = useMemo<TokenInterface[]>(() => {
    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TokenInterface[] = [];

      for (const asset of nonZeroBalanceTokensList) {
        const { name, symbol, address } = asset;

        if (
          name.toLowerCase().includes(lowerCaseSearchValue) ||
          symbol.toLowerCase().includes(lowerCaseSearchValue) ||
          address.toLowerCase().includes(lowerCaseSearchValue)
        ) {
          result.push(asset);
        }
      }

      return result;
    } else {
      return nonZeroBalanceTokensList;
    }
  }, [searchValue, tokensList, nonZeroBalanceTokensList]);

  return {
    filteredTokensList,
    searchValue,
    setSearchValue
  };
};
