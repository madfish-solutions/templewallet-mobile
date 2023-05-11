import { useMemo } from 'react';

import { SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { useTokenExchangeRateGetter } from 'src/hooks/use-token-exchange-rate-getter.hook';
import { useAssetsListSelector } from 'src/store/wallet/wallet-selectors';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { convertFarmToken } from 'src/utils/staking.utils';

export const useFarmTokens = (farm?: SingleFarmResponse) => {
  const getExchangeRate = useTokenExchangeRateGetter();
  const accountAssetsList = useAssetsListSelector();

  return useMemo(
    () =>
      isDefined(farm)
        ? farm.item.tokens.map(token => {
            const tokenSlug = toTokenSlug(token.contractAddress, token.fa2TokenId);
            const accountAsset = accountAssetsList.find(({ address, id }) => toTokenSlug(address, id) === tokenSlug);

            return (
              accountAsset ?? {
                ...convertFarmToken(token),
                exchangeRate: getExchangeRate(tokenSlug),
                balance: '0'
              }
            );
          })
        : [],
    [farm, getExchangeRate, accountAssetsList]
  );
};
