import { createEntity } from '../store/create-entity';
import { AccountStateInterface } from './account-settings.interface';
import { AccountInterface } from './account.interface';

export type WalletAccountStateInterface = AccountInterface & AccountStateInterface;

export const emptyWalletAccountState: WalletAccountStateInterface = {
  name: '',
  publicKey: '',
  publicKeyHash: 'empty_public_key_hash',
  tezosBalance: createEntity('0'),
  tokensList: [],
  activityGroups: createEntity([]),
  pendingActivities: []
};
