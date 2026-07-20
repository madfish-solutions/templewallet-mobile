import { TezosTokenMetadata } from '../token/interfaces/token-metadata.interface';

export interface SendAssetActionPayloadInterface {
  asset: TezosTokenMetadata;
  receiverPublicKeyHash: string;
  amount: string;
}
