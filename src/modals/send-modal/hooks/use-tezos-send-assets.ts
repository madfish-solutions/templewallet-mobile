import { BigNumber } from 'bignumber.js';
import { uniqBy } from 'lodash-es';
import { useMemo } from 'react';

import { useShieldedBalanceSelector } from 'src/store/sapling';
import { useAssetExchangeRate } from 'src/store/settings/settings-selectors';
import { TEZ_SHIELDED_TOKEN_METADATA, TEZ_SHIELDED_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { TezosSendAsset } from 'src/types/send-asset';
import { useCurrentAccountCollectibles, useCurrentAccountTokens } from 'src/utils/assets/hooks';

import { toTezosSendAsset } from '../tezos-send-asset.mapper';

interface CreateTezosSendAssetsParams {
  shieldedBalance: string;
  shieldedExchangeRate?: number;
  tezosToken: TokenInterface;
  tezosTokens: TokenInterface[];
}

export const createTezosSendAssets = ({
  shieldedBalance,
  shieldedExchangeRate,
  tezosToken,
  tezosTokens
}: CreateTezosSendAssetsParams): TezosSendAsset[] => {
  const shieldedToken: TokenInterface | undefined =
    shieldedBalance === '0'
      ? undefined
      : {
          ...TEZ_SHIELDED_TOKEN_METADATA,
          balance: shieldedBalance,
          exchangeRate: shieldedExchangeRate,
          visibility: tezosToken.visibility
        };

  return uniqBy([tezosToken, ...(shieldedToken ? [shieldedToken] : []), ...tezosTokens], getTokenSlug)
    .filter(token => new BigNumber(token.balance).isGreaterThan(0))
    .map(toTezosSendAsset);
};

export const useTezosSendAssets = (tezosToken: TokenInterface): TezosSendAsset[] => {
  const tezosTokens = useCurrentAccountTokens(true);
  const tezosCollectibles = useCurrentAccountCollectibles(true);
  const shieldedBalance = useShieldedBalanceSelector();
  const shieldedExchangeRate = useAssetExchangeRate(TEZ_SHIELDED_TOKEN_SLUG);

  return useMemo(
    () =>
      createTezosSendAssets({
        shieldedBalance,
        shieldedExchangeRate,
        tezosToken,
        tezosTokens: [...tezosTokens, ...tezosCollectibles]
      }),
    [shieldedBalance, shieldedExchangeRate, tezosCollectibles, tezosToken, tezosTokens]
  );
};
