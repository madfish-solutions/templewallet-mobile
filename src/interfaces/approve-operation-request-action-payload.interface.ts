import { OperationRequestOutput } from '@airgap/beacon-sdk';
import { WalletParamsWithKind } from '@taquito/taquito';

import { WalletAccountInterface } from './wallet-account.interface';

export interface ApproveOperationRequestActionPayloadInterface {
  message: OperationRequestOutput;
  sender: WalletAccountInterface;
  opParams: WalletParamsWithKind[];
}
