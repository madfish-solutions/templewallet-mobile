export interface SaplingAccountState {
  saplingAddress: string | null;
  viewingKey: string | null;
  shieldedBalance: string;
  isCredentialsLoaded: boolean;
  isBalanceLoading: boolean;
}

import type { ParamsWithKind } from '@taquito/taquito';

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
  isBalanceLoading: false
};

export const saplingInitialState: SaplingState = {
  accountsRecord: {},
  hasSeenAnnouncement: false,
  isPreparing: false,
  preparedOpParams: null
};
