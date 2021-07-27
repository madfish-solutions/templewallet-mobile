import { ParamsWithKind } from './op-params.interface';
import { WalletAccountInterface } from './wallet-account.interface';

export interface LoadEstimationsActionPayloadInterface {
  sender: WalletAccountInterface;
  opParams: ParamsWithKind[];
}
