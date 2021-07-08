import { AssetMetadataInterface } from '../token/interfaces/token-metadata.interface';

export interface SendAssetActionPayloadInterface {
  asset: AssetMetadataInterface;
  receiverPublicKeyHash: string;
  amount: number;
}
