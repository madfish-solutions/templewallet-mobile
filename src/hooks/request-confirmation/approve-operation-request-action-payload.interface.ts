import { OperationRequestOutput } from '@airgap/beacon-sdk';
import { ParamsWithKind } from '@taquito/taquito';

import { AccountInterface } from '../../interfaces/account.interface';

export interface ApproveOperationRequestActionPayloadInterface {
  rpcUrl: string;
  sender: AccountInterface;
  opParams: ParamsWithKind[];
  message: OperationRequestOutput;
}
