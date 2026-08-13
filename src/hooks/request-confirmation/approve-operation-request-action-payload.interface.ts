import { OperationRequestOutput } from '@tezos-x/octez.connect-sdk';
import { ParamsWithKind } from '@taquito/taquito';

import { ReadOnlySignerPayload } from 'src/types/read-only-signer-payload';

export interface ApproveOperationRequestActionPayloadInterface {
  rpcUrl: string;
  sender: ReadOnlySignerPayload;
  opParams: ParamsWithKind[];
  message: OperationRequestOutput;
}
