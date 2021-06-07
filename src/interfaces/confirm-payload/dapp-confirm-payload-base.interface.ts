import { ConfirmPayloadBase } from './confirm-payload-base.interface';
import { ConfirmPayloadTypeEnum } from './confirm-payload-type.enum';
import { DAppMetadata } from './dapp-metadata.interface';

export interface DAppConfirmPayloadBase extends ConfirmPayloadBase {
  type: ConfirmPayloadTypeEnum.connect | ConfirmPayloadTypeEnum.confirm_operations | ConfirmPayloadTypeEnum.sign;
  origin: string;
  networkRpc: string;
  appMeta: DAppMetadata;
}
