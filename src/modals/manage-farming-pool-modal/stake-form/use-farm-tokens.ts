import { useMemo } from 'react';

import { SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { useTokenExchangeRateGetter } from 'src/hooks/use-token-exchange-rate-getter.hook';
import {
  useAssetsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector
} from 'src/store/wallet/wallet-selectors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { convertEarnOpportunityToken } from 'src/utils/earn.utils';
import { isDefined } from 'src/utils/is-defined';

export const useFarmTokens = (farm?: SingleFarmResponse) => {
  const getExchangeRate = useTokenExchangeRateGetter();
  const accountAssetsList = useAssetsListSelector();
  const { publicKeyHash: accountPkh } = useSelectedAccountSelector();
  const tezToken = useTezosTokenSelector(accountPkh);

  return useMemo(
    () =>
      isDefined(farm)
        ? farm.item.tokens.map(token => {
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
    [farm, getExchangeRate, accountAssetsList, tezToken]
  );
};
