import { ConfirmPayloadType } from './confirm-payload-type.enum';
import { DAppConfirmPayloadBase } from './dapp-confirm-payload-base.interface';

export interface DAppSignPayload extends DAppConfirmPayloadBase {
  type: ConfirmPayloadType.sign;
  sourcePkh: string;
  payload: string;
  preview: any;
}
