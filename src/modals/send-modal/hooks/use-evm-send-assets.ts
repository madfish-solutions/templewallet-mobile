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
import { EvmCollectibleMetadata } from 'src/token/interfaces/token-metadata.interface';
import { EvmSendAsset } from 'src/types/send-asset';
import { buildEvmAssetCatalog, EvmAssetNetwork, toEvmSendAsset } from 'src/utils/assets/evm';

interface CreateEvmSendAssetsParams {
  assets: EvmChainAssetsRecord;
  balances: Record<string, string>;
  collectiblesMetadata: Record<string, EvmCollectibleMetadata>;
  exchangeRates: Record<string, number>;
  fiatToUsdRate?: number;
  hasAccount: boolean;
  network?: EvmAssetNetwork;
  tokensMetadata: Record<string, EvmStoredTokenMetadata>;
}

const createEvmSendAssets = ({
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

  return buildEvmAssetCatalog({
    assets,
    balances,
    collectiblesMetadata,
    exchangeRates,
    fiatToUsdRate,
    tokensMetadata
  }).flatMap(item => {
    if ((!item.isNative && !item.isVisible) || !new BigNumber(item.balance).isGreaterThan(0)) {
      return [];
    }

    const asset = toEvmSendAsset(item, network);

    return asset ? [asset] : [];
  });
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
