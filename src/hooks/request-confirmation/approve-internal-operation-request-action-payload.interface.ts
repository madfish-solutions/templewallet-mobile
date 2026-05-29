import { ParamsWithKind } from '@taquito/taquito';

import { TezosReadOnlySignerPayload } from 'src/types/tezos-read-only-signer-payload';

export interface ApproveInternalOperationRequestActionPayloadInterface {
  rpcUrl: string;
  sender: TezosReadOnlySignerPayload;
  opParams: ParamsWithKind[];
}
