import { ParamsWithKind } from '@taquito/taquito';

import { AccountInterface } from '../../interfaces/account.interface';

export interface ApproveInternalOperationRequestActionPayloadInterface {
  rpcUrl: string;
  sender: AccountInterface;
  opParams: ParamsWithKind[];
}
