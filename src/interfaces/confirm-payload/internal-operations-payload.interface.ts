import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';

import { ConfirmPayloadType } from './confirm-payload-type.enum';
import { InternalConfirmPayloadBase } from './internal-confirm-payload-base.interface';

export interface InternalOperationsPayload extends InternalConfirmPayloadBase {
  type: ConfirmPayloadType.internalOperations;
  opParams: any[];
  bytesToSign?: string;
  rawToSign?: any;
  estimates?: Estimate[];
}
