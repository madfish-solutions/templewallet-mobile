import { omit } from 'lodash-es';

import {
  emptyWalletAccountState,
  initialWalletAccountState,
  WalletAccountStateInterface
} from './wallet-account-state.interface';

export type WalletAccountInterface = Omit<WalletAccountStateInterface, 'activityGroups' | 'pendingActivities'>;

export const initialWalletAccount: WalletAccountInterface = omit(initialWalletAccountState, [
  'activityGroups',
  'pendingActivities'
]);

export const emptyWalletAccount: WalletAccountInterface = omit(emptyWalletAccountState, [
  'activityGroups',
  'pendingActivities'
]);
