import { ParamsWithKind } from '../../interfaces/op-params.interface';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';

export interface ApproveInternalOperationRequestActionPayloadInterface {
  rpcUrl: string;
  sender: WalletAccountInterface;
  opParams: ParamsWithKind[];
}
