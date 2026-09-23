import { VisibilityEnum } from 'src/enums/visibility.enum';
import { EvmChainAssetsRecord } from 'src/store/evm/assets/evm-assets-state';
import { EvmStoredTokenMetadata } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-state';
import {
  EvmCollectibleMetadata,
  EvmAssetStandardEnum,
  EVM_TOKEN_SLUG
} from 'src/token/interfaces/token-metadata.interface';
import { isDefined } from 'src/utils/is-defined';

export interface EvmAssetCatalogItem {
  assetSlug: string;
  balance: string;
  collectibleMetadata?: EvmCollectibleMetadata;
  exchangeRate?: number;
  isManual: boolean;
  isNative: boolean;
  isVisible: boolean;
  standard?: EvmAssetStandardEnum;
  tokenMetadata?: EvmStoredTokenMetadata;
}

interface BuildEvmAssetCatalogParams {
  assets: EvmChainAssetsRecord;
  balances: Record<string, string>;
  collectiblesMetadata?: Record<string, EvmCollectibleMetadata>;
  exchangeRates: Record<string, number>;
  fiatToUsdRate?: number;
  tokensMetadata: Record<string, EvmStoredTokenMetadata>;
}

export const buildEvmAssetCatalog = ({
  assets,
  balances,
  collectiblesMetadata = {},
  exchangeRates,
  fiatToUsdRate,
  tokensMetadata
}: BuildEvmAssetCatalogParams): EvmAssetCatalogItem[] => {
  const assetSlugs = new Set([EVM_TOKEN_SLUG, ...Object.keys(assets), ...Object.keys(balances)]);

  return [...assetSlugs].map(assetSlug => {
    const asset = assets[assetSlug];
    const isNative = assetSlug === EVM_TOKEN_SLUG;
    const usdRate = exchangeRates[assetSlug];

    return {
      assetSlug,
      balance: balances[assetSlug] ?? '0',
      collectibleMetadata: collectiblesMetadata[assetSlug],
      exchangeRate: isDefined(usdRate) && isDefined(fiatToUsdRate) ? usdRate * fiatToUsdRate : undefined,
      isManual: asset?.manual === true,
      isNative,
      isVisible: isNative || asset?.visibility !== VisibilityEnum.Hidden,
      standard: isNative
        ? EvmAssetStandardEnum.NATIVE
        : asset?.standard ?? tokensMetadata[assetSlug]?.standard ?? collectiblesMetadata[assetSlug]?.standard,
      tokenMetadata: tokensMetadata[assetSlug]
    };
  });
};
