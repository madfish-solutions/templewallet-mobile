import { ConfirmPayloadBase } from './confirm-payload-base.interface';
import { ConfirmPayloadType } from './confirm-payload-type.enum';

export interface InternalConfirmPayloadBase extends ConfirmPayloadBase {
  type: ConfirmPayloadType.internalOperations | ConfirmPayloadType.internalSign;
  sourcePkh: string;
}
