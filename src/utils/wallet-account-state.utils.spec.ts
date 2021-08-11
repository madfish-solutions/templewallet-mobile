import { omit } from 'lodash-es';

import { initialAccount } from '../interfaces/account.interface';
import { WalletAccountStateInterface } from '../interfaces/wallet-account-state.interface';
import { mockWalletAccountState } from '../interfaces/wallet-account-state.interface.mock';
import { walletAccountStateToWalletAccount } from './wallet-account-state.utils';

describe('walletAccountStateToWalletAccount', () => {
  it('should omit activityGroups and pendingActivities', () => {
    const result = walletAccountStateToWalletAccount(mockWalletAccountState);

    expect(mockWalletAccountState).toHaveProperty('activityGroups');
    expect(mockWalletAccountState).toHaveProperty('pendingActivities');

    expect(result).not.toHaveProperty('activityGroups');
    expect(result).not.toHaveProperty('pendingActivities');
  });
  it('should add missing field initial value', () => {
    const mockWalletAccountStateWithoutType = omit(mockWalletAccountState, ['type']) as WalletAccountStateInterface;

    const result = walletAccountStateToWalletAccount(mockWalletAccountStateWithoutType);

    expect(mockWalletAccountStateWithoutType).not.toHaveProperty('type');
    expect(result.type).toEqual(initialAccount.type);
  });
});
