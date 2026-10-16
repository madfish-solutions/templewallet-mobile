import { ParamsWithKind } from '@taquito/taquito';

import { TezosReadOnlySignerPayload } from 'src/types/tezos-read-only-signer-payload';

export interface ApproveInternalOperationRequestActionPayloadInterface {
  sender: TezosReadOnlySignerPayload;
  opParams: ParamsWithKind[];
}
