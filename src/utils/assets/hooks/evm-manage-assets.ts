import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { toEvmSendAsset } from 'src/modals/send-modal/evm-send-asset.mapper';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { EvmSendAsset } from 'src/types/send-asset';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

export type EvmManageAsset = EvmSendAsset & {
  address: string;
  id: number;
  isVisible: boolean;
};

export const useCurrentAccountEvmManageAssets = (): EvmManageAsset[] => {
  const account = useAccountAddressForEvm();
  const chain = useEvmChain(ETHERLINK_MAINNET_CHAIN_ID);
  const assets = useEvmAccountChainAssetsSelector(account, ETHERLINK_MAINNET_CHAIN_ID);
  const balances = useEvmAccountChainBalancesSelector(account, ETHERLINK_MAINNET_CHAIN_ID);
  const collectiblesMetadata = useEvmChainCollectiblesMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const tokensMetadata = useEvmChainTokensMetadataSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const exchangeRates = useEvmChainExchangeRatesSelector(ETHERLINK_MAINNET_CHAIN_ID);
  const fiatToUsdRate = useFiatToUsdRateSelector();

  return useMemo(() => {
    if (!account || !chain) {
      return [];
    }

    const assetSlugs = new Set([...Object.keys(assets), ...Object.keys(balances)]);

    return [...assetSlugs].flatMap(assetSlug => {
      const asset = assets[assetSlug];
      const standard =
        asset?.standard ?? tokensMetadata[assetSlug]?.standard ?? collectiblesMetadata[assetSlug]?.standard;
      if (!standard) {
        return [];
      }

      const balance = balances[assetSlug] ?? '0';
      if (!asset?.manual && !new BigNumber(balance).isGreaterThan(0)) {
        return [];
      }

      const usdRate = exchangeRates[assetSlug];
      const exchangeRate = usdRate != null && fiatToUsdRate != null ? usdRate * fiatToUsdRate : undefined;
      const mappedAsset = toEvmSendAsset({
        assetSlug,
        balance,
        exchangeRate,
        network: { ...chain, nativeIconName: CryptoLogoNameEnum.Tezos },
        standard,
        tokenMetadata: tokensMetadata[assetSlug],
        collectibleMetadata: collectiblesMetadata[assetSlug]
      });

      return mappedAsset
        ? [
            {
              ...mappedAsset,
              address: 'contractAddress' in mappedAsset ? mappedAsset.contractAddress : mappedAsset.assetSlug,
              id: 0,
              isVisible: standard === EvmAssetStandardEnum.NATIVE || asset?.visibility !== VisibilityEnum.Hidden
            }
          ]
        : [];
    });
  }, [account, assets, balances, chain, collectiblesMetadata, exchangeRates, fiatToUsdRate, tokensMetadata]);
};

export const isEvmCollectibleManageAsset = (asset: EvmManageAsset) =>
  asset.sendStandard === EvmAssetStandardEnum.ERC721 || asset.sendStandard === EvmAssetStandardEnum.ERC1155;
