import { PermissionRequestOutput } from '@airgap/beacon-sdk';

import { Account } from 'src/interfaces/account.interfaces';

export interface ApprovePermissionRequestActionPayloadInterface {
  message: PermissionRequestOutput;
  approver: Account;
}
