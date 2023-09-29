import { CollectibleInterface } from 'src/token/interfaces/collectible-interfaces.interface';

import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';

export interface SendAssetActionPayloadInterface {
  asset: TokenMetadataInterface | CollectibleInterface;
  receiverPublicKeyHash: string;
  amount: number;
}
