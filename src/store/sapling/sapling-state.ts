import { ParamsWithKind } from '@taquito/taquito';

import type { SaplingTransactionHistoryItem } from 'src/interfaces/sapling-service.interface';

export interface SaplingAccountState {
  saplingAddress: string | null;
  viewingKey: string | null;
  shieldedBalance: string;
  isCredentialsLoaded: boolean;
  failedToLoadCredentials: boolean;
  isBalanceLoading: boolean;
  transactionHistory: SaplingTransactionHistoryItem[];
  isHistoryLoading: boolean;
}

export interface SaplingState {
  accountsRecord: Record<string, SaplingAccountState>;
  hasSeenAnnouncement: boolean;
  isPreparing: boolean;
  preparedOpParams: ParamsWithKind[] | null;
}

export const initialSaplingAccountState: SaplingAccountState = {
  saplingAddress: null,
  viewingKey: null,
  shieldedBalance: '0',
  isCredentialsLoaded: false,
  failedToLoadCredentials: false,
  isBalanceLoading: false,
  transactionHistory: [],
  isHistoryLoading: false
};

export const saplingInitialState: SaplingState = {
  accountsRecord: {},
  hasSeenAnnouncement: false,
  isPreparing: false,
  preparedOpParams: null
};
