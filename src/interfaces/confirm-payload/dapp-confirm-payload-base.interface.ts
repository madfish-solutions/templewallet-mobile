import { ConfirmPayloadBase } from './confirm-payload-base.interface';
import { ConfirmPayloadType } from './confirm-payload-type.enum';
import { DAppMetadata } from './dapp-metadata.interface';

export interface DAppConfirmPayloadBase extends ConfirmPayloadBase {
  type: ConfirmPayloadType.connect | ConfirmPayloadType.confirm_operations | ConfirmPayloadType.sign;
  origin: string;
  networkRpc: string;
  appMeta: DAppMetadata;
}
