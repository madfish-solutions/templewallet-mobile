import { AccountSettingsInterface, emptyAccountSettings } from './account-settings.interface';
import { AccountInterface, emptyAccount } from './account.interface';

export type WalletAccountInterface = AccountInterface & AccountSettingsInterface;

export const emptyWalletAccount: WalletAccountInterface = {
  ...emptyAccount,
  ...emptyAccountSettings
};
