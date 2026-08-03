import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import {
  EvmAssetStandardEnum,
  EvmNativeTokenMetadata,
  EvmTokenMetadata,
  EVM_TOKEN_SLUG
} from 'src/token/interfaces/token-metadata.interface';
import { EvmNativeSendAsset, EvmSendAsset } from 'src/types/send-asset';
import { toChainAssetSlug } from 'src/utils/chain-asset-slug';
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
}

export const toEvmSendAsset = ({
  assetSlug,
  balance,
  exchangeRate,
  network,
  standard,
  tokenMetadata
}: ToEvmSendAssetParams): EvmSendAsset | undefined => {
  const isNative = standard === EvmAssetStandardEnum.NATIVE;
  const decimals = isNative ? network.currency.decimals : tokenMetadata?.decimals;

  if (!isDefined(decimals)) {
    return undefined;
  }

  const symbol = (isNative ? network.currency.symbol : tokenMetadata?.symbol) ?? 'Token';
  const name = (isNative ? network.currency.name : tokenMetadata?.name) ?? symbol;
  const commonAsset: Omit<EvmNativeSendAsset, 'assetSlug' | 'sendStandard'> = {
    name,
    symbol,
    decimals,
    iconName: isNative ? network.nativeIconName : undefined,
    thumbnailUri: isNative ? network.currency.iconURL : tokenMetadata?.iconURL,
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

  const contractAddress = tokenMetadata?.address;
  if (standard !== EvmAssetStandardEnum.ERC20 || !contractAddress || contractAddress === EVM_TOKEN_SLUG) {
    return undefined;
  }

  return { ...commonAsset, assetSlug, sendStandard: EvmAssetStandardEnum.ERC20, contractAddress };
};
