import { useMemo } from 'react';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useEvmAccountChainAssetsSelector } from 'src/store/evm/assets/evm-assets-selectors';
import { useEvmAccountChainBalancesSelector } from 'src/store/evm/balances/evm-balances-selectors';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { useAccountAddressForEvm } from 'src/store/wallet/wallet-selectors';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { buildEvmAssetCatalog, EvmDisplayedAsset, toEvmDisplayedAsset } from 'src/utils/assets/evm';
import { isPositiveNumber } from 'src/utils/number.util';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

interface EvmManageAsset extends EvmDisplayedAsset {
  isVisible: boolean;
}

export type ManageAsset = TokenInterface | EvmManageAsset;

export const isEvmManageAsset = (asset: ManageAsset): asset is EvmManageAsset =>
  asset.chainKind === TempleChainKind.EVM;

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

    return buildEvmAssetCatalog({
      assets,
      balances,
      collectiblesMetadata,
      exchangeRates,
      fiatToUsdRate,
      tokensMetadata
    }).flatMap(item => {
      if (!item.isNative && !item.isManual && !isPositiveNumber(item.balance)) {
        return [];
      }

      const mappedAsset = toEvmDisplayedAsset(item, {
        ...chain,
        nativeIconName: CryptoLogoNameEnum.Tezos
      });

      return mappedAsset ? [{ ...mappedAsset, isVisible: item.isVisible }] : [];
    });
  }, [account, assets, balances, chain, collectiblesMetadata, exchangeRates, fiatToUsdRate, tokensMetadata]);
};

export const isEvmCollectibleManageAsset = (asset: EvmManageAsset) =>
  asset.standard === EvmAssetStandardEnum.ERC721 || asset.standard === EvmAssetStandardEnum.ERC1155;
