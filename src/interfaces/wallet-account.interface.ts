import { createEntity } from '../store/create-entity';
import { AccountSettingsInterface } from './account-settings.interface';
import { AccountInterface } from './account.interface';

export type WalletAccountInterface = AccountInterface & AccountSettingsInterface;

export const emptyWalletAccount: WalletAccountInterface = {
  name: '',
  publicKey: '',
  publicKeyHash: 'empty_public_key_hash',
  tezosBalance: createEntity('0'),
  tokensList: []
};
