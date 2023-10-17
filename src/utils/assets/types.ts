import type { TokenInterface } from 'src/token/interfaces/token.interface';

export interface UsableAccountAsset extends TokenInterface {
  slug: string;
}

export interface AssetMediaURIs {
  thumbnailUri?: string;
  displayUri?: string;
  artifactUri?: string;
}
