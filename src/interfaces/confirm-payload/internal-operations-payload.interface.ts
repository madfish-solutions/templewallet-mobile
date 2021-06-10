import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';

import { ConfirmPayloadTypeEnum } from './confirm-payload-type.enum';
import { InternalConfirmPayloadBase } from './internal-confirm-payload-base.interface';

export interface InternalOperationsPayload extends InternalConfirmPayloadBase {
  type: ConfirmPayloadTypeEnum.InternalOperations;
  operationsParams: any[];
  bytesToSign?: string;
  rawToSign?: any;
  estimates?: Estimate[];
}
