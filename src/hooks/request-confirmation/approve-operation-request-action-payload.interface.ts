import { OperationRequestOutput } from '@airgap/beacon-sdk';
import { ParamsWithKind } from '@taquito/taquito';

import { WalletAccountInterface } from '../../interfaces/wallet-account.interface';

export interface ApproveOperationRequestActionPayloadInterface {
  rpcUrl: string;
  sender: WalletAccountInterface;
  opParams: ParamsWithKind[];
  message: OperationRequestOutput;
}
