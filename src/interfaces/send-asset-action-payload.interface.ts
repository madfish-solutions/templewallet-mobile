import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';

export interface SendAssetActionPayloadInterface {
  asset: TokenMetadataInterface;
  receiverPublicKeyHash: string;
  amount: string;
}
