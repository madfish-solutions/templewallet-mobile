import { Estimate } from '@taquito/taquito/dist/types/contract/estimate';

import { ConfirmPayloadTypeEnum } from './confirm-payload-type.enum';
import { DAppConfirmPayloadBase } from './dapp-confirm-payload-base.interface';

export interface DAppOperationsPayload extends DAppConfirmPayloadBase {
  type: ConfirmPayloadTypeEnum.ConfirmOperations;
  sourcePkh: string;
  sourcePublicKey: string;
  opParams: any[];
  bytesToSign?: string;
  rawToSign?: any;
  estimates?: Estimate[];
}
