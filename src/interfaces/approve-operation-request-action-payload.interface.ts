import { OperationRequestOutput } from '@airgap/beacon-sdk';

import { ParamsWithKind } from './op-params.interface';
import { WalletAccountInterface } from './wallet-account.interface';

export interface ApproveOperationRequestActionPayloadInterface {
  message: OperationRequestOutput;
  sender: WalletAccountInterface;
  opParams: ParamsWithKind[];
}
