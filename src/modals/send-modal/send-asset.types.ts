import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { EvmAssetStandardEnum } from 'src/token/interfaces/token-metadata.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';

export type SendAssetStandard = EvmAssetStandardEnum | 'tezos' | 'shielded-tez';

export interface SendAsset extends TokenInterface {
  assetKey: string;
  assetSlug: string;
  chainKind: TempleChainKind;
  chainId: string | number;
  networkName: string;
  sendStandard: SendAssetStandard;
  contractAddress?: HexString;
  tokenId?: string;
}

export const isEvmSendAsset = (asset: SendAsset): boolean => asset.chainKind === TempleChainKind.EVM;
