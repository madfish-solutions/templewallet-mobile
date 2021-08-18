import { createAction } from '@reduxjs/toolkit';

import { AccountInterface } from '../../interfaces/account.interface';
import { ActivityGroup } from '../../interfaces/activity.interface';
import { ParamsWithKind } from '../../interfaces/op-params.interface';
import { SendAssetActionPayloadInterface } from '../../interfaces/send-asset-action-payload.interface';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { createActions } from '../create-actions';

export const setSelectedAccountAction = createAction<string | undefined>('wallet/SET_SELECTED_ACCOUNT');
export const addHdAccountAction = createAction<AccountInterface>('wallet/ADD-HD-ACCOUNT');

// TODO: extract AssetsState
export const loadTokenBalancesActions =
  createActions<string, { balancesList: Array<string>; metadataList: TokenMetadataInterface[] }, string>(
    'assets/LOAD_TOKENS'
  );
export const loadTezosBalanceActions = createActions<string, string, string>('assets/LOAD_TEZOS');

export const loadTokenSuggestionActions =
  createActions<Pick<TokenMetadataInterface, 'id' | 'address'>, TokenMetadataInterface, string>(
    'assets/LOAD_TOKEN_SUGGESTION'
  );
export const loadTokenMetadataActions =
  createActions<Pick<TokenMetadataInterface, 'id' | 'address'>, TokenMetadataInterface, string>(
    'assets/LOAD_TOKEN_METADATA'
  );

export const addTokenMetadataAction = createAction<TokenMetadataInterface>('assets/ADD_TOKEN_METADATA');
export const removeTokenAction = createAction<string>('assets/REMOVE_TOKEN');
export const toggleTokenVisibilityAction = createAction<string>('assets/TOGGLE_TOKEN_VISIBILITY');

export const sendAssetActions = createActions<SendAssetActionPayloadInterface, string, string>('wallet/SEND_ASSET');

export const loadActivityGroupsActions = createActions<string, ActivityGroup[], string>('wallet/LOAD_ACTIVITY_GROUPS');
export const addPendingOperation = createAction<ActivityGroup>('wallet/ADD_PENDING_OPERATION');

export const approveInternalOperationRequestAction = createAction<ParamsWithKind[]>(
  'wallet/APPROVE_INTERNAL_OPERATION_REQUEST'
);
export const waitForOperationCompletionAction = createAction<{
  opHash: string;
  sender: AccountInterface;
}>('d-apps/WAIT_FOR_OPERATION_COMPLETION');
