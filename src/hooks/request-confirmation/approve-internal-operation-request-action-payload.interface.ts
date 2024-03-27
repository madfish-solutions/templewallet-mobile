import { ParamsWithKind } from '@taquito/taquito';

import { ReadOnlySignerPayload } from 'src/types/read-only-signer-payload';

export interface ApproveInternalOperationRequestActionPayloadInterface {
  rpcUrl: string;
  sender: ReadOnlySignerPayload;
  opParams: ParamsWithKind[];
}
