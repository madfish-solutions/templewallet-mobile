import { AssetInterface } from 'src/interfaces/asset.interface';
import { EvmStoredTokenMetadata } from 'src/store/evm/tokens-metadata/evm-tokens-metadata-state';
import { EvmCollectibleMetadata, EvmNativeTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { EvmAssetStandard } from 'src/utils/evm/on-chain/types';
import { isDefined } from 'src/utils/is-defined';

interface BuildEvmPreviewAssetParams {
  standard: EvmAssetStandard;
  assetSlug: string;
  nativeCurrency?: EvmNativeTokenMetadata;
  tokensMetadata: Record<string, EvmStoredTokenMetadata>;
  collectiblesMetadata: Record<string, EvmCollectibleMetadata>;
  exchangeRate?: number;
}

export const buildEvmPreviewAsset = ({
  standard,
  assetSlug,
  nativeCurrency,
  tokensMetadata,
  collectiblesMetadata,
  exchangeRate
}: BuildEvmPreviewAssetParams): AssetInterface | undefined => {
  if (standard === EvmAssetStandard.NATIVE && isDefined(nativeCurrency?.decimals)) {
    return {
      name: nativeCurrency.name,
      symbol: nativeCurrency.symbol,
      decimals: nativeCurrency.decimals,
      balance: '0',
      exchangeRate,
      thumbnailUri: nativeCurrency.iconURL
    };
  }

  if (standard === EvmAssetStandard.ERC20) {
    const tokenMetadata = tokensMetadata[assetSlug];

    if (!isDefined(tokenMetadata?.decimals)) {
      return undefined;
    }

    return {
      name: tokenMetadata.name ?? tokenMetadata.symbol ?? '???',
      symbol: tokenMetadata.symbol ?? '???',
      decimals: tokenMetadata.decimals,
      balance: '0',
      exchangeRate,
      thumbnailUri: tokenMetadata.iconURL
    };
  }

  if (standard === EvmAssetStandard.ERC721 || standard === EvmAssetStandard.ERC1155) {
    const collectibleMetadata = collectiblesMetadata[assetSlug];

    if (!isDefined(collectibleMetadata)) {
      return undefined;
    }

    const symbol = collectibleMetadata.symbol ?? 'NFT';

    return {
      name: collectibleMetadata.collectibleName ?? collectibleMetadata.name ?? symbol,
      symbol,
      decimals: 0,
      balance: '0',
      thumbnailUri: collectibleMetadata.image ?? collectibleMetadata.iconURL
    };
  }

  return undefined;
};

export const hasUsableEvmPreviewMetadata = (
  standard: EvmAssetStandard,
  assetSlug: string,
  nativeCurrency: EvmNativeTokenMetadata | undefined,
  tokensMetadata: Record<string, EvmStoredTokenMetadata>,
  collectiblesMetadata: Record<string, EvmCollectibleMetadata>
) => {
  if (standard === EvmAssetStandard.NATIVE) {
    return isDefined(nativeCurrency?.decimals);
  }

  if (standard === EvmAssetStandard.ERC20) {
    return isDefined(tokensMetadata[assetSlug]?.decimals);
  }

  if (standard === EvmAssetStandard.ERC721 || standard === EvmAssetStandard.ERC1155) {
    return isDefined(collectiblesMetadata[assetSlug]);
  }

  return false;
};
