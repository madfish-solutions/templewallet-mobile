import { ConfirmPayloadTypeEnum } from './confirm-payload-type.enum';
import { InternalConfirmPayloadBase } from './internal-confirm-payload-base.interface';

export interface InternalSignPayload extends InternalConfirmPayloadBase {
  type: ConfirmPayloadTypeEnum.internalSign;
  bytes: string;
  watermark?: string;
}
