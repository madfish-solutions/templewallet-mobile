import { omit } from 'lodash-es';

import { WalletAccountStateInterface } from '../interfaces/wallet-account-state.interface';
import { initialWalletAccount, WalletAccountInterface } from '../interfaces/wallet-account.interface';

export const walletAccountStateToWalletAccount = (
  walletAccountState: WalletAccountStateInterface
): WalletAccountInterface => ({
  ...initialWalletAccount,
  ...omit(walletAccountState, ['activityGroups', 'pendingActivities'])
});
