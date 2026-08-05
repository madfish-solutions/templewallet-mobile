import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { EvmChainAssetsRecord } from 'src/store/evm/assets/evm-assets-state';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { EvmStoredTokenMetadata } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-state';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import {
  EvmAssetStandardEnum,
  EvmCollectibleMetadata,
  EVM_TOKEN_SLUG
} from 'src/token/interfaces/token-metadata.interface';
import { EvmSendAsset } from 'src/types/send-asset';
import { isDefined } from 'src/utils/is-defined';

import { EvmSendNetwork, toEvmSendAsset } from '../evm-send-asset.mapper';

interface CreateEvmSendAssetsParams {
  assets: EvmChainAssetsRecord;
  balances: Record<string, string>;
  collectiblesMetadata: Record<string, EvmCollectibleMetadata>;
  exchangeRates: Record<string, number>;
  fiatToUsdRate?: number;
  hasAccount: boolean;
  network?: EvmSendNetwork;
  tokensMetadata: Record<string, EvmStoredTokenMetadata>;
}

export const createEvmSendAssets = ({
  assets,
  balances,
  collectiblesMetadata,
  exchangeRates,
  fiatToUsdRate,
  hasAccount,
  network,
  tokensMetadata
}: CreateEvmSendAssetsParams): EvmSendAsset[] => {
  if (!hasAccount || !network) {
    return [];
  }

  const allEvmSlugs = new Set([EVM_TOKEN_SLUG, ...Object.keys(assets), ...Object.keys(balances)]);
  const sendAssets: EvmSendAsset[] = [];

  for (const assetSlug of allEvmSlugs) {
    const isNative = assetSlug === EVM_TOKEN_SLUG;
    const standard = isNative
      ? EvmAssetStandardEnum.NATIVE
      : assets[assetSlug]?.standard ?? tokensMetadata[assetSlug]?.standard;

    if (!standard) {
      continue;
    }

    const balance = balances[assetSlug] ?? '0';
    if (!new BigNumber(balance).isGreaterThan(0)) {
      continue;
    }

    const tokenMetadata = tokensMetadata[assetSlug];
    const usdRate = exchangeRates[assetSlug];
    const exchangeRate = isDefined(usdRate) && isDefined(fiatToUsdRate) ? usdRate * fiatToUsdRate : undefined;
    const asset = toEvmSendAsset({
      assetSlug,
      balance,
      exchangeRate,
      network,
      standard,
      tokenMetadata,
      collectibleMetadata: collectiblesMetadata[assetSlug]
    });

    if (asset) {
      sendAssets.push(asset);
    }
  }

  return sendAssets;
};

export const useEvmSendAssets = (chainId: number, nativeIconName?: CryptoLogoNameEnum): EvmSendAsset[] => {
  const evmAddress = useAccountAddressForEvm();
  const network = useEvmChain(chainId);
  const assets = useEvmAccountChainAssetsSelector(evmAddress, chainId);
  const balances = useEvmAccountChainBalancesSelector(evmAddress, chainId);
  const collectiblesMetadata = useEvmChainCollectiblesMetadataSelector(chainId);
  const tokensMetadata = useEvmChainTokensMetadataSelector(chainId);
  const exchangeRates = useEvmChainExchangeRatesSelector(chainId);
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useMemo(
    () =>
      createEvmSendAssets({
        assets,
        balances,
        collectiblesMetadata,
        exchangeRates,
        fiatToUsdRate,
        hasAccount: Boolean(evmAddress),
        network: network ? { ...network, nativeIconName } : undefined,
        tokensMetadata
      }),
    [
      assets,
      balances,
      collectiblesMetadata,
      evmAddress,
      exchangeRates,
      fiatToUsdRate,
      nativeIconName,
      network,
      tokensMetadata
    ]
  );
};
