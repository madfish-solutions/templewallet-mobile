import { ConfirmPayloadBase } from './confirm-payload-base.interface';
import { ConfirmPayloadTypeEnum } from './confirm-payload-type.enum';

export interface InternalConfirmPayloadBase extends ConfirmPayloadBase {
  type: ConfirmPayloadTypeEnum.InternalOperations | ConfirmPayloadTypeEnum.InternalSign;
  sourcePublicKeyHash: string;
}
