import { ParamsWithKind } from '@taquito/taquito';

import { Account } from 'src/interfaces/account.interfaces';

export interface ApproveInternalOperationRequestActionPayloadInterface {
  rpcUrl: string;
  sender: Account;
  opParams: ParamsWithKind[];
}
