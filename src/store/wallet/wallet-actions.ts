import { createAction } from '@reduxjs/toolkit';

import { Account } from 'src/interfaces/account.interfaces';
import { SendAssetActionPayloadInterface } from 'src/interfaces/send-asset-action-payload.interface';
import { TezosTokenMetadata } from 'src/token/interfaces/token-metadata.interface';
import { TezosReadOnlySignerPayload } from 'src/types/tezos-read-only-signer-payload';

import { createActions } from '../create-actions';

export const setSelectedAccountIdAction = createAction<string | undefined>('wallet/SET_SELECTED_ACCOUNT_ID');
export const addAccountAction = createAction<Account>('wallet/ADD_ACCOUNT');
export const completeEvmAccountsMigrationAction = createAction<Account[]>('wallet/COMPLETE_EVM_ACCOUNTS_MIGRATION');

export const updateAccountAction = createAction<Account>('wallet/UPDATE_ACCOUNT');

export const setAccountVisibility = createAction<{ accountId: string; isVisible: boolean }>(
  'wallet/SET_ACCOUNT_VISIBILITY'
);

export const loadTezosBalanceActions = createActions<void, StringRecord, string>('assets/LOAD_TEZOS');

export const highPriorityLoadTokenBalanceAction = createAction<{
  accountId: string;
  publicKeyHash: string;
  slug: string;
}>('assets/HIGH_PRIORITY_LOAD_TOKEN_BALANCE');
export const loadAssetsBalancesActions = createActions<
  void,
  { accountId: string; publicKeyHash: string; balances: StringRecord },
  string
>('assets/LOAD_TOKENS_BALANCES');

/** TODO: add `ofDcpNetwork` flag to payload */
export const addTokenAction = createAction<TezosTokenMetadata>('assets/ADD_TOKEN');
export const removeTokenAction = createAction<string>('assets/REMOVE_TOKEN');
export const toggleTokenVisibilityAction = createAction<{ slug: string }>('assets/TOGGLE_TOKEN_VISIBILITY');

export const sendAssetActions = createActions<SendAssetActionPayloadInterface, string, string>('wallet/SEND_ASSET');

export const waitForOperationCompletionAction = createAction<{
  opHash: string;
  sender: TezosReadOnlySignerPayload;
}>('d-apps/WAIT_FOR_OPERATION_COMPLETION');
