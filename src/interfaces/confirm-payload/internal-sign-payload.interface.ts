import { ConfirmPayloadType } from './confirm-payload-type.enum';
import { InternalConfirmPayloadBase } from './internal-confirm-payload-base.interface';

export interface InternalSignPayload extends InternalConfirmPayloadBase {
  type: ConfirmPayloadType.internalSign;
  bytes: string;
  watermark?: string;
}
