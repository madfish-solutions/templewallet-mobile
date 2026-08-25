import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AssetInterface } from 'src/interfaces/asset.interface';
import {
  EvmAssetStandardEnum,
  EvmNativeTokenMetadata,
  EVM_TOKEN_SLUG
} from 'src/token/interfaces/token-metadata.interface';
import { EvmSendAsset } from 'src/types/send-asset';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { isDefined } from 'src/utils/is-defined';

import { EvmAssetCatalogItem } from './asset-catalog';

export interface EvmAssetNetwork {
  chainId: number;
  currency: EvmNativeTokenMetadata;
  name: string;
  nativeIconName?: CryptoLogoNameEnum;
}

export interface EvmDisplayedAsset extends AssetInterface {
  assetKey: string;
  assetSlug: string;
  chainId: number;
  chainKind: TempleChainKind.EVM;
  networkName: string;
  standard: EvmAssetStandardEnum;
}

export const toEvmDisplayedAsset = (
  item: EvmAssetCatalogItem,
  network: EvmAssetNetwork
): EvmDisplayedAsset | undefined => {
  const { assetSlug, balance, collectibleMetadata, exchangeRate, standard, tokenMetadata } = item;
  if (!standard) {
    return undefined;
  }

  const isNative = standard === EvmAssetStandardEnum.NATIVE;
  const isCollectible = standard === EvmAssetStandardEnum.ERC721 || standard === EvmAssetStandardEnum.ERC1155;
  const decimals = isNative ? network.currency.decimals : isCollectible ? 0 : tokenMetadata?.decimals;

  if (!isDefined(decimals)) {
    return undefined;
  }

  const symbol =
    (isNative ? network.currency.symbol : isCollectible ? collectibleMetadata?.symbol : tokenMetadata?.symbol) ??
    (isCollectible ? 'NFT' : 'Token');
  const name =
    (isNative
      ? network.currency.name
      : isCollectible
      ? collectibleMetadata?.collectibleName ?? collectibleMetadata?.name
      : tokenMetadata?.name) ?? symbol;

  return {
    name,
    symbol,
    decimals,
    iconName: isNative ? network.nativeIconName : undefined,
    thumbnailUri: isNative
      ? network.currency.iconURL
      : isCollectible
      ? collectibleMetadata?.image ?? collectibleMetadata?.iconURL
      : tokenMetadata?.iconURL,
    balance,
    exchangeRate,
    assetKey: toChainAssetSlug(TempleChainKind.EVM, network.chainId, assetSlug),
    assetSlug,
    chainKind: TempleChainKind.EVM,
    chainId: network.chainId,
    networkName: network.name,
    standard
  };
};

export const toEvmSendAsset = (item: EvmAssetCatalogItem, network: EvmAssetNetwork): EvmSendAsset | undefined => {
  const displayedAsset = toEvmDisplayedAsset(item, network);
  if (!displayedAsset) {
    return undefined;
  }

  const { standard, ...commonAsset } = displayedAsset;
  const { assetSlug, tokenMetadata, collectibleMetadata } = item;

  if (standard === EvmAssetStandardEnum.NATIVE) {
    return { ...commonAsset, assetSlug: EVM_TOKEN_SLUG, sendStandard: EvmAssetStandardEnum.NATIVE };
  }

  if (standard === EvmAssetStandardEnum.ERC20) {
    const contractAddress = tokenMetadata?.address;

    return contractAddress && contractAddress !== EVM_TOKEN_SLUG
      ? { ...commonAsset, assetSlug, sendStandard: EvmAssetStandardEnum.ERC20, contractAddress }
      : undefined;
  }

  const [slugContractAddress, tokenId] = fromTokenSlug<HexString>(assetSlug);
  const contractAddress = collectibleMetadata?.address ?? slugContractAddress;
  if (!contractAddress || !tokenId || !standard) {
    return undefined;
  }

  return { ...commonAsset, assetSlug, sendStandard: standard, contractAddress, tokenId };
};
