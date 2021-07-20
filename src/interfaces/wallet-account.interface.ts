import { createEntity } from '../store/create-entity';
import { WalletAccountStateInterface } from './wallet-account-state.interface';

export type WalletAccountInterface = Omit<WalletAccountStateInterface, 'activityGroups' | 'pendingActivities'>;

export const emptyWalletAccount: WalletAccountInterface = {
  name: '',
  publicKey: '',
  publicKeyHash: 'empty_public_key_hash',
  tezosBalance: createEntity('0'),
  tokensList: []
};
