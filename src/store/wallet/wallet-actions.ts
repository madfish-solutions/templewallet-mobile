import { createAction } from '@reduxjs/toolkit';

import { AccountInterface } from 'src/interfaces/account.interface';
import { SendAssetActionPayloadInterface } from 'src/interfaces/send-asset-action-payload.interface';
import { WalletSpecsInterface } from 'src/interfaces/wallet-specs.interface';
import { TokenMetadataInterface } from 'src/token/interfaces/token-metadata.interface';
import { ReadOnlySignerPayload } from 'src/types/read-only-signer-payload';

import { createActions } from '../create-actions';

export const setSelectedAccountIdAction = createAction<string | undefined>('wallet/SET_SELECTED_ACCOUNT_ID');
export const addHdAccountAction = createAction<AccountInterface>('wallet/ADD_HD_ACCOUNT');
export const setWalletSpecsAction = createAction<WalletSpecsInterface>('wallet/SET_WALLET_SPECS');
export const completeEvmAccountsMigrationAction = createAction<{
  accounts: AccountInterface[];
  selectedAccountId: string;
  walletsSpecsRecord: Record<string, WalletSpecsInterface>;
}>('wallet/COMPLETE_EVM_ACCOUNTS_MIGRATION');

export const updateAccountAction = createAction<AccountInterface>('wallet/UPDATE_ACCOUNT');

export const setAccountVisibility = createAction<{ publicKeyHash: string; isVisible: boolean }>(
  'wallet/SET_ACCOUNT_VISIBILITY'
);

export const loadTezosBalanceActions = createActions<void, StringRecord, string>('assets/LOAD_TEZOS');

export const highPriorityLoadTokenBalanceAction = createAction<{ publicKeyHash: string; slug: string }>(
  'assets/HIGH_PRIORITY_LOAD_TOKEN_BALANCE'
);
export const loadAssetsBalancesActions = createActions<
  void,
  { publicKeyHash: string; balances: StringRecord; selectedRpcUrl: string },
  string
>('assets/LOAD_TOKENS_BALANCES');

/** TODO: add `ofDcpNetwork` flag to payload */
export const addTokenAction = createAction<TokenMetadataInterface>('assets/ADD_TOKEN');
export const removeTokenAction = createAction<string>('assets/REMOVE_TOKEN');
export const toggleTokenVisibilityAction = createAction<{ slug: string; selectedRpcUrl: string }>(
  'assets/TOGGLE_TOKEN_VISIBILITY'
);

export const sendAssetActions = createActions<SendAssetActionPayloadInterface, string, string>('wallet/SEND_ASSET');

export const waitForOperationCompletionAction = createAction<{
  opHash: string;
  sender: ReadOnlySignerPayload;
}>('d-apps/WAIT_FOR_OPERATION_COMPLETION');
