import { ConfirmPayloadTypeEnum } from './confirm-payload-type.enum';
import { InternalConfirmPayloadBase } from './internal-confirm-payload-base.interface';

export interface InternalSignPayload extends InternalConfirmPayloadBase {
  type: ConfirmPayloadTypeEnum.InternalSign;
  bytes: string;
  watermark?: string;
}
