import { ConfirmPayloadType } from './confirm-payload-type.enum';
import { DAppConfirmPayloadBase } from './dapp-confirm-payload-base.interface';

export interface DAppConnectPayload extends DAppConfirmPayloadBase {
  type: ConfirmPayloadType.connect;
}
