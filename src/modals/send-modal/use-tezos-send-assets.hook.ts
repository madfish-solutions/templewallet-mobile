import { ChainIds } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { uniqBy } from 'lodash-es';
import { useMemo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useShieldedBalanceSelector } from 'src/store/sapling';
import { useAssetExchangeRate } from 'src/store/settings/settings-selectors';
import { TEZ_SHIELDED_TOKEN_METADATA, TEZ_SHIELDED_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { useCurrentAccountTokens } from 'src/utils/assets/hooks';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';

import { SendAsset } from './send-asset.types';

const TEZOS_NETWORK_NAME = 'Tezos';

interface CreateTezosSendAssetsParams {
  shieldedBalance: string;
  shieldedExchangeRate?: number;
  tezosToken: TokenInterface;
  tezosTokens: TokenInterface[];
}

const toTezosSendAsset = (token: TokenInterface): SendAsset => {
  const assetSlug = getTokenSlug(token);

  return {
    ...token,
    assetKey: toChainAssetSlug(TempleChainKind.Tezos, ChainIds.MAINNET, assetSlug),
    assetSlug,
    chainKind: TempleChainKind.Tezos,
    chainId: ChainIds.MAINNET,
    networkName: TEZOS_NETWORK_NAME,
    sendStandard: assetSlug === TEZ_SHIELDED_TOKEN_SLUG ? 'shielded-tez' : 'tezos'
  };
};

export const createTezosSendAssets = ({
  shieldedBalance,
  shieldedExchangeRate,
  tezosToken,
  tezosTokens
}: CreateTezosSendAssetsParams): SendAsset[] => {
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

export const useTezosSendAssets = (tezosToken: TokenInterface): SendAsset[] => {
  const tezosTokens = useCurrentAccountTokens(true);
  const shieldedBalance = useShieldedBalanceSelector();
  const shieldedExchangeRate = useAssetExchangeRate(TEZ_SHIELDED_TOKEN_SLUG);

  return useMemo(
    () => createTezosSendAssets({ shieldedBalance, shieldedExchangeRate, tezosToken, tezosTokens }),
    [shieldedBalance, shieldedExchangeRate, tezosToken, tezosTokens]
  );
};
