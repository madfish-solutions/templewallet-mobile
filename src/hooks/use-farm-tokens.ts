import { useCallback, useMemo } from 'react';

import { FarmToken } from 'src/apis/quipuswap-staking/types';
import { useTokenExchangeRateGetter } from 'src/hooks/use-token-exchange-rate-getter.hook';
import {
  useAssetsListSelector,
  useSelectedAccountSelector,
  useTezosTokenSelector
} from 'src/store/wallet/wallet-selectors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { emptyTezosLikeToken } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { Farm } from 'src/types/farm';
import { isDefined } from 'src/utils/is-defined';
import { convertFarmToken } from 'src/utils/staking.utils';

export const useFarmTokens = (farm?: Farm) => {
  const getExchangeRate = useTokenExchangeRateGetter();
  const accountAssetsList = useAssetsListSelector();
  const { publicKeyHash: accountPkh } = useSelectedAccountSelector();
  const tezToken = useTezosTokenSelector(accountPkh);

  const convertToken = useCallback(
    (token: FarmToken) => {
      const tokenAddress = token.contractAddress === 'tez' ? undefined : token.contractAddress;
      const tokenSlug = toTokenSlug(tokenAddress, token.fa2TokenId);
      const accountAsset =
        tokenSlug === TEZ_TOKEN_SLUG
          ? tezToken
          : accountAssetsList.find(({ address, id }) => toTokenSlug(address, id) === tokenSlug);

      return (
        accountAsset ?? {
          ...convertFarmToken(token),
          exchangeRate: getExchangeRate(tokenSlug),
          balance: '0'
        }
      );
    },
    [getExchangeRate, accountAssetsList, tezToken]
  );

  return useMemo(
    () => ({
      stakeTokens: farm?.tokens.map(convertToken) ?? [],
      rewardToken: isDefined(farm) ? convertToken(farm.rewardToken) : emptyTezosLikeToken
    }),
    [farm, convertToken]
  );
};
