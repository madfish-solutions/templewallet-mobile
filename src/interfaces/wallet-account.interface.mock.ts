import { omit } from 'lodash-es';

import { mockWalletAccountState } from './wallet-account-state.interface.mock';
import { WalletAccountInterface } from './wallet-account.interface';

export const mockWalletAccount: WalletAccountInterface = omit(mockWalletAccountState, [
  'activityGroups',
  'pendingActivities'
]);
