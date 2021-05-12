import { AccountSettingsInterface } from './account-settings.interface';
import { AccountInterface } from './account.interface';

export type WalletAccountInterface = AccountInterface & AccountSettingsInterface;

export const emptyWalletAccount: WalletAccountInterface = {
  name: '',
  publicKey: '',
  publicKeyHash: '',
  tezosBalance: { isLoading: false, data: '0' },
  tokensList: []
};
