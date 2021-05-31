import { DAppConnectPayload } from './dapp-connect-payload.interface';
import { DAppOperationsPayload } from './dapp-operations-payload.interface';
import { DAppSignPayload } from './dapp-sign-payload.interface';
import { InternalOperationsPayload } from './internal-operations-payload.interface';
import { InternalSignPayload } from './internal-sign-payload.interface';

export type ConfirmPayload =
  | DAppConnectPayload
  | DAppOperationsPayload
  | DAppSignPayload
  | InternalOperationsPayload
  | InternalSignPayload;
