import { OperationRequestOutput } from '@airgap/beacon-sdk';

import { ParamsWithKind } from '../../interfaces/op-params.interface';
import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';

export interface ApproveOperationRequestActionPayloadInterface {
  message: OperationRequestOutput;
  sender: WalletAccountInterface;
  opParams: ParamsWithKind[];
}
