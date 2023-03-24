import { useMemo, useState } from 'react';

import { useSwapTokensSelector } from 'src/store/swap/swap-selectors';
import { useSelectedAccountTezosTokenSelector, useTokensListSelector } from 'src/store/wallet/wallet-selectors';
import { toTokenSlug } from 'src/token/utils/token.utils';

import { TokenInterface } from '../token/interfaces/token.interface';
import { isString } from '../utils/is-string';
import { isNonZeroBalance } from '../utils/tezos.util';

export enum TokensInputsEnum {
  From = 'From',
  To = 'To'
}

export const useFilteredSwapTokensList = (tokensInput: TokensInputsEnum = TokensInputsEnum.From) => {
  const { data: swapTokens } = useSwapTokensSelector();
  const userTokens = useTokensListSelector();
  const tezosToken = useSelectedAccountTezosTokenSelector();

  const balances = useMemo<Record<string, string>>(
    () =>
      [tezosToken, ...userTokens].reduce(
        (accumulator, token) => ({ ...accumulator, [toTokenSlug(token.address, token.id)]: token.balance }),
        {}
      ),
    [userTokens]
  );

  const swapTokensWithBalances = useMemo<Array<TokenInterface>>(() => {
    const result = swapTokens.map(token => ({
      ...token,
      balance: balances[toTokenSlug(token.address, token.id)] ?? '0'
    }));

    return result;
  }, [swapTokens, tezosToken, balances]);

  const fromTokens = useMemo(() => swapTokensWithBalances.filter(isNonZeroBalance), [swapTokensWithBalances]);

  const [searchValue, setSearchValue] = useState<string>();
  const filteredTokensList = useMemo<TokenInterface[]>(() => {
    const source = tokensInput === TokensInputsEnum.From ? fromTokens : swapTokensWithBalances;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TokenInterface[] = [];

      for (const asset of source) {
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
      return source;
    }
  }, [searchValue, fromTokens, swapTokensWithBalances]);

  return {
    filteredTokensList,
    searchValue,
    setSearchValue
  };
};
