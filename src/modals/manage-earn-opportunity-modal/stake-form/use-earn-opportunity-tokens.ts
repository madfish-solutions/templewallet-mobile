import { useMemo } from 'react';

import { useTokenExchangeRateGetter } from 'src/hooks/use-token-exchange-rate-getter.hook';
import {
  useAssetsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector
} from 'src/store/wallet/wallet-selectors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { EarnOpportunity } from 'src/types/earn-opportunity.type';
import { convertEarnOpportunityToken } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';

export const useEarnOpportunityTokens = (earnOpportunity?: EarnOpportunity) => {
  const getExchangeRate = useTokenExchangeRateGetter();
  const accountAssetsList = useAssetsListSelector();
  const { publicKeyHash: accountPkh } = useSelectedAccountSelector();
  const tezToken = useTezosTokenSelector(accountPkh);

  return useMemo(
    () =>
      isDefined(earnOpportunity)
        ? earnOpportunity.tokens.map(token => {
            const tokenAddress = token.contractAddress === 'tez' ? undefined : token.contractAddress;
            const tokenSlug = toTokenSlug(tokenAddress, token.fa2TokenId);
            const accountAsset =
              tokenSlug === TEZ_TOKEN_SLUG
                ? tezToken
                : accountAssetsList.find(({ address, id }) => toTokenSlug(address, id) === tokenSlug);

            return (
              accountAsset ?? {
                ...convertEarnOpportunityToken(token),
                exchangeRate: getExchangeRate(tokenSlug),
                balance: '0'
              }
            );
          })
        : [],
    [earnOpportunity, getExchangeRate, accountAssetsList, tezToken]
  );
};
