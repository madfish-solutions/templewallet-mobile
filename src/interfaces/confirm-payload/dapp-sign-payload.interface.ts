import { ConfirmPayloadTypeEnum } from './confirm-payload-type.enum';
import { DAppConfirmPayloadBase } from './dapp-confirm-payload-base.interface';

export interface DAppSignPayload extends DAppConfirmPayloadBase {
  type: ConfirmPayloadTypeEnum.sign;
  sourcePkh: string;
  payload: string;
  preview: any;
}
