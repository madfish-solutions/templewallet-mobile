import { createAction } from '@reduxjs/toolkit';

import { AccountInterface } from 'src/interfaces/account.interface';
import { SendAssetActionPayloadInterface } from 'src/interfaces/send-asset-action-payload.interface';
import { TokenBalanceResponse } from 'src/interfaces/token-balance-response.interface';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';

import { createActions } from '../create-actions';

export const setSelectedAccountAction = createAction<string | undefined>('wallet/SET_SELECTED_ACCOUNT');
export const addHdAccountAction = createAction<AccountInterface>('wallet/ADD_HD_ACCOUNT');

export const updateAccountAction = createAction<AccountInterface>('wallet/UPDATE_ACCOUNT');

export const setAccountVisibility = createAction<{ publicKeyHash: string; isVisible: boolean }>(
  'wallet/SET_ACCOUNT_VISIBILITY'
);

export const loadTokensActions = createActions<void, string[], string>('assets/LOAD_TOKENS');
export const loadTezosBalanceActions = createActions<void, string, string>('assets/LOAD_TEZOS');

export const highPriorityLoadTokenBalanceAction = createAction<{ publicKeyHash: string; slug: string }>(
  'assets/HIGH_PRIORITY_LOAD_TOKEN_BALANCE'
);
export const loadTokensBalancesArrayActions = createActions<
  void,
  { publicKeyHash: string; data: TokenBalanceResponse[]; selectedRpcUrl: string },
  string
>('assets/LOAD_TOKENS_BALANCES');

export const addTokenAction = createAction<TokenMetadataInterface>('assets/ADD_TOKEN');
export const removeTokenAction = createAction<string>('assets/REMOVE_TOKEN');
export const toggleTokenVisibilityAction = createAction<{ slug: string; selectedRpcUrl: string }>(
  'assets/TOGGLE_TOKEN_VISIBILITY'
);

export const sendAssetActions = createActions<SendAssetActionPayloadInterface, string, string>('wallet/SEND_ASSET');

export const waitForOperationCompletionAction = createAction<{
  opHash: string;
  sender: AccountInterface;
}>('d-apps/WAIT_FOR_OPERATION_COMPLETION');
