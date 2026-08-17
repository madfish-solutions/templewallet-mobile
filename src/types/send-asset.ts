import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AssetInterface } from 'src/interfaces/asset.interface';
import { EvmAssetStandardEnum, EVM_TOKEN_SLUG } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

interface SendAssetBase extends AssetInterface {
  assetKey: string;
  assetSlug: string;
  chainKind: TempleChainKind;
  chainId: string | number;
  networkName: string;
}

export type TezosSendAsset = SendAssetBase &
  TokenInterface & {
    chainKind: TempleChainKind.Tezos;
    chainId: string;
    sendStandard: 'tezos' | 'shielded-tez';
  };

interface EvmSendAssetBase extends SendAssetBase {
  chainKind: TempleChainKind.EVM;
  chainId: number;
}

export interface EvmNativeSendAsset extends EvmSendAssetBase {
  assetSlug: typeof EVM_TOKEN_SLUG;
  sendStandard: EvmAssetStandardEnum.NATIVE;
}

interface EvmTokenSendAsset extends EvmSendAssetBase {
  sendStandard: EvmAssetStandardEnum.ERC20;
  contractAddress: HexString;
}

interface EvmCollectibleSendAsset extends EvmSendAssetBase {
  sendStandard: EvmAssetStandardEnum.ERC721 | EvmAssetStandardEnum.ERC1155;
  contractAddress: HexString;
  tokenId: string;
}

export type EvmSendAsset = EvmNativeSendAsset | EvmTokenSendAsset | EvmCollectibleSendAsset;
export type SendAsset = TezosSendAsset | EvmSendAsset;

export const isTezosSendAsset = (asset: SendAsset): asset is TezosSendAsset =>
  asset.chainKind === TempleChainKind.Tezos;
