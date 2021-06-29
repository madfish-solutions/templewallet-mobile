import { AssetMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { WalletAccountInterface } from './wallet-account.interface';

export interface SendAssetActionPayloadInterface {
  asset: AssetMetadataInterface;
  sender: WalletAccountInterface;
  receiverPublicKeyHash: string;
  amount: number;
}
