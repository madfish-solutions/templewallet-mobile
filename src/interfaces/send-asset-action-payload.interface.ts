import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';

export interface SendAssetActionPayloadInterface {
  token: TokenMetadataInterface;
  receiverPublicKeyHash: string;
  amount: number;
}
