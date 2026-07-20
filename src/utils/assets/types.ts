import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import type { EvmCollectibleMetadata } from 'src/token/interfaces/token-metadata.interface';
import type { TokenInterface } from 'src/token/interfaces/token.interface';

export interface UsableAccountAsset extends TokenInterface {
  slug: string;
  visibility: VisibilityEnum.Visible | VisibilityEnum.Hidden;
}

interface TezosDisplayedCollectible {
  chainKind: TempleChainKind.Tezos;
  slug: string;
  asset: UsableAccountAsset;
}

export interface EvmDisplayedCollectible {
  chainKind: TempleChainKind.EVM;
  slug: string;
  chainId: number;
  tokenId: string;
  balance: string;
  metadata?: EvmCollectibleMetadata;
}

export type DisplayedCollectible = TezosDisplayedCollectible | EvmDisplayedCollectible;

export interface AssetMediaURIs {
  thumbnailUri?: string;
  displayUri?: string;
  artifactUri?: string;
}
