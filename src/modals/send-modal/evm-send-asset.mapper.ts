import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import {
  EvmAssetStandardEnum,
  EvmCollectibleMetadata,
  EvmNativeTokenMetadata,
  EvmTokenMetadata,
  EVM_TOKEN_SLUG
} from 'src/token/interfaces/token-metadata.interface';
import { EvmNativeSendAsset, EvmSendAsset } from 'src/types/send-asset';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
import { fromTokenSlug } from 'src/utils/from-token-slug';
import { isDefined } from 'src/utils/is-defined';

export interface EvmSendNetwork {
  chainId: number;
  currency: EvmNativeTokenMetadata;
  name: string;
  nativeIconName?: CryptoLogoNameEnum;
}

interface ToEvmSendAssetParams {
  assetSlug: string;
  balance: string;
  exchangeRate?: number;
  network: EvmSendNetwork;
  standard: EvmAssetStandardEnum;
  tokenMetadata?: EvmTokenMetadata | EvmNativeTokenMetadata;
  collectibleMetadata?: EvmCollectibleMetadata;
}

export const toEvmSendAsset = ({
  assetSlug,
  balance,
  exchangeRate,
  network,
  standard,
  tokenMetadata,
  collectibleMetadata
}: ToEvmSendAssetParams): EvmSendAsset | undefined => {
  const isNative = standard === EvmAssetStandardEnum.NATIVE;
  const isCollectible = standard === EvmAssetStandardEnum.ERC721 || standard === EvmAssetStandardEnum.ERC1155;
  const decimals = isNative ? network.currency.decimals : isCollectible ? 0 : tokenMetadata?.decimals;

  if (!isDefined(decimals)) {
    return undefined;
  }

  const [, tokenId] = isCollectible ? fromTokenSlug(assetSlug) : [];
  const symbol =
    (isNative ? network.currency.symbol : isCollectible ? collectibleMetadata?.symbol : tokenMetadata?.symbol) ??
    (isCollectible ? 'NFT' : 'Token');
  const name =
    (isNative
      ? network.currency.name
      : isCollectible
      ? collectibleMetadata?.collectibleName ?? collectibleMetadata?.name
      : tokenMetadata?.name) ?? symbol;
  const commonAsset: Omit<EvmNativeSendAsset, 'assetSlug' | 'sendStandard'> = {
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
    chainKind: TempleChainKind.EVM,
    chainId: network.chainId,
    networkName: network.name
  };

  if (isNative) {
    return { ...commonAsset, assetSlug: EVM_TOKEN_SLUG, sendStandard: EvmAssetStandardEnum.NATIVE };
  }

  if (standard === EvmAssetStandardEnum.ERC20) {
    const contractAddress = tokenMetadata?.address;

    return contractAddress && contractAddress !== EVM_TOKEN_SLUG
      ? { ...commonAsset, assetSlug, sendStandard: EvmAssetStandardEnum.ERC20, contractAddress }
      : undefined;
  }

  const contractAddress = collectibleMetadata?.address ?? (fromTokenSlug(assetSlug)[0] as HexString | undefined);
  if (!contractAddress || !tokenId) return undefined;

  return {
    ...commonAsset,
    assetSlug,
    sendStandard: standard,
    contractAddress,
    tokenId
  };
};
