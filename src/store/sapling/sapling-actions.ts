import { createAction } from '@reduxjs/toolkit';
import { ParamsWithKind } from '@taquito/taquito';

import type { SaplingTransactionHistoryItem } from 'src/interfaces/sapling-service.interface';

import { createActions } from '../create-actions';

export const loadSaplingCredentialsActions = createActions<
  void,
  { publicKeyHash: string; saplingAddress: string; viewingKey: string },
  string
>('sapling/LOAD_CREDENTIALS');

export const loadShieldedBalanceActions = createActions<void, { publicKeyHash: string; balance: string }, string>(
  'sapling/LOAD_SHIELDED_BALANCE'
);

export interface PrepareSaplingTxPayload {
  type: 'shield' | 'unshield' | 'transfer';
  amount: string;
  recipientAddress: string;
  memo?: string;
  isRebalance?: boolean;
}

export const prepareSaplingTransactionActions = createActions<PrepareSaplingTxPayload, ParamsWithKind[], string>(
  'sapling/PREPARE_TRANSACTION'
);

export const cancelSaplingPreparationAction = createAction('sapling/CANCEL_PREPARATION');

export const setHasSeenAnnouncementAction = createAction('sapling/SET_HAS_SEEN_ANNOUNCEMENT');

export const loadSaplingTransactionHistoryActions = createActions<
  void,
  { publicKeyHash: string; transactions: SaplingTransactionHistoryItem[] },
  string
>('sapling/LOAD_TRANSACTION_HISTORY');

export const clearSaplingCredentialsAction = createAction('sapling/CLEAR_CREDENTIALS');
export const clearPreparedOpParamsAction = createAction('sapling/CLEAR_PREPARED_OP_PARAMS');
