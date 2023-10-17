import { useMemo, useState } from 'react';

import { useSwapTokensMetadataSelector } from 'src/store/swap/swap-selectors';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { useAccountTokensBalancesRecord } from 'src/utils/assets/hooks';
import { applySortByDollarValueDecrease, isAssetSearched } from 'src/utils/token-metadata.utils';
import { useTezosTokenOfCurrentAccount } from 'src/utils/wallet.utils';

import { TokenInterface } from '../token/interfaces/token.interface';
import { isString } from '../utils/is-string';
import { isNonZeroBalance } from '../utils/tezos.util';
import { useTokenExchangeRateGetter } from './use-token-exchange-rate-getter.hook';

export enum TokensInputsEnum {
  From = 'From',
  To = 'To'
}

export const useFilteredSwapTokensList = (
  tokensInput: TokensInputsEnum = TokensInputsEnum.From,
  currentlySelectedTokenSlug?: string
) => {
  const { data: swapTokensMetadata } = useSwapTokensMetadataSelector();
  const tezosToken = useTezosTokenOfCurrentAccount();
  const getTokenExchangeRate = useTokenExchangeRateGetter();

  const balances = useAccountTokensBalancesRecord();

  const swapTokensWithBalances = useMemo<Array<TokenInterface>>(() => {
    const result = swapTokensMetadata.map<TokenInterface>(token => {
      const slug = toTokenSlug(token.address, token.id);

      return {
        ...token,
        exchangeRate: getTokenExchangeRate(slug),
        balance: balances[slug] ?? '0'
      };
    });

    applySortByDollarValueDecrease(result);

    result.unshift(tezosToken);

    return result;
  }, [swapTokensMetadata, tezosToken, balances]);

  const fromTokens = useMemo(() => swapTokensWithBalances.filter(isNonZeroBalance), [swapTokensWithBalances]);

  const [searchValue, setSearchValue] = useState<string>();
  const filteredTokensList = useMemo<TokenInterface[]>(() => {
    const tokenSlugEqualToCurrentToken = (token: TokenInterface) =>
      toTokenSlug(token.address, token.id) === currentlySelectedTokenSlug;
    const currentlySelectedToken = swapTokensWithBalances.find(tokenSlugEqualToCurrentToken);
    const source = tokensInput === TokensInputsEnum.From ? fromTokens : swapTokensWithBalances;
    const withCurrentlySelectedToken = (tokens: TokenInterface[]) =>
      currentlySelectedToken && !tokens.some(tokenSlugEqualToCurrentToken)
        ? tokens.concat([currentlySelectedToken])
        : tokens;

    if (isString(searchValue)) {
      const lowerCaseSearchValue = searchValue.toLowerCase();
      const result: TokenInterface[] = [];

      for (const asset of source) {
        if (Boolean(isAssetSearched(asset, lowerCaseSearchValue))) {
          result.push(asset);
        }
      }

      return withCurrentlySelectedToken(result);
    } else {
      return withCurrentlySelectedToken(source);
    }
  }, [searchValue, fromTokens, swapTokensWithBalances, currentlySelectedTokenSlug]);

  return {
    filteredTokensList,
    searchValue,
    setSearchValue
  };
};
