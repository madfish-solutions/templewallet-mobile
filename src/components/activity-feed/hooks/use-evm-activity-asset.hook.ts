import { useMemo } from 'react';

import { EvmActivityAsset } from 'src/activity/types';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { useEvmChain } from 'src/hooks/evm/use-evm-chains.hook';
import { useEvmChainCollectiblesMetadataSelector } from 'src/store/evm/collectibles-metadata/evm-collectibles-metadata-selectors';
import { useEvmChainExchangeRatesSelector } from 'src/store/evm/exchange-rates/evm-exchange-rates-selectors';
import { useEvmChainTokensMetadataSelector } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-selectors';
import { useFiatToUsdRateSelector } from 'src/store/settings/settings-selectors';
import { EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { toEvmAssetSlug } from 'src/utils/from-token-slug';

import { ActivityAssetImageKind, ActivityAssetImageSource, ActivityAssetView, ActivityRowAsset } from '../types';

export const useEvmActivityAsset = (chainId: number, assetBase?: EvmActivityAsset): ActivityAssetView => {
  const tokensMetadata = useEvmChainTokensMetadataSelector(chainId);
  const collectiblesMetadata = useEvmChainCollectiblesMetadataSelector(chainId);
  const exchangeRates = useEvmChainExchangeRatesSelector(chainId);
  const fiatToUsdRate = useFiatToUsdRateSelector();
  const evmChain = useEvmChain(chainId);

  const nativeCurrency = evmChain?.currency;

  return useMemo(() => {
    if (assetBase == null) {
      return {};
    }

    const slug = toEvmAssetSlug(assetBase.contract, assetBase.tokenId);
    const isNative = slug === EVM_TOKEN_SLUG;
    const collectibleMetadata = collectiblesMetadata[slug];
    const tokenMetadata = isNative ? nativeCurrency : tokensMetadata[slug];
    const isNft = assetBase.nft === true || collectibleMetadata != null;

    const symbol = collectibleMetadata?.symbol ?? tokenMetadata?.symbol ?? assetBase.symbol;
    const decimals = tokenMetadata?.decimals ?? assetBase.decimals;
    const iconURL = tokenMetadata?.iconURL ?? assetBase.iconURL;
    const collectibleImageUri = collectibleMetadata?.image ?? collectibleMetadata?.iconURL ?? assetBase.iconURL;

    const image: ActivityAssetImageSource = isNft
      ? { kind: ActivityAssetImageKind.evmCollectibleImage, imageUri: collectibleImageUri }
      : isNative && iconURL == null
      ? { kind: ActivityAssetImageKind.cryptoLogo, name: CryptoLogoNameEnum.Etherlink }
      : { kind: ActivityAssetImageKind.evmTokenIcon, chainId, contract: assetBase.contract, iconURL };

    const asset: ActivityRowAsset = {
      contract: assetBase.contract,
      amountSigned: assetBase.amountSigned,
      decimals,
      symbol: symbol === '' ? undefined : symbol,
      isNft,
      image
    };

    const usdRate = exchangeRates[slug];
    const fiatRate = isNft || usdRate == null || fiatToUsdRate == null ? undefined : usdRate * fiatToUsdRate;

    return { asset, fiatRate };
  }, [assetBase, chainId, tokensMetadata, collectiblesMetadata, exchangeRates, fiatToUsdRate, nativeCurrency]);
};
