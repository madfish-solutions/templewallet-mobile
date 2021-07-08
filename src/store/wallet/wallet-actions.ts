import { createAction } from '@reduxjs/toolkit';
import { WalletParamsWithKind } from '@taquito/taquito';

import { AccountInterface } from '../../interfaces/account.interface';
import { ActivityGroup } from '../../interfaces/activity.interface';
import { EstimationInterface } from '../../interfaces/estimation.interface';
import { LoadEstimationsActionPayloadInterface } from '../../interfaces/load-estimations-action-payload.interface';
import { SendAssetActionPayloadInterface } from '../../interfaces/send-asset-action-payload.interface';
import { TokenBalanceInterface } from '../../token/interfaces/token-balance.interface';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { createActions } from '../create-actions';

export const setSelectedAccountAction = createAction<string | undefined>('wallet/SET_SELECTED_ACCOUNT');
export const addHdAccountAction = createAction<AccountInterface>('wallet/ADD-HD-ACCOUNT');

// TODO: extract AssetsState
export const loadTokenBalancesActions = createActions<string, TokenBalanceInterface[], string>('assets/LOAD_TOKENS');
export const loadTezosBalanceActions = createActions<string, string, string>('assets/LOAD_TEZOS');

export const loadTokenMetadataActions =
  createActions<Pick<TokenMetadataInterface, 'id' | 'address'>, TokenMetadataInterface, string>(
    'assets/LOAD_TOKEN_METADATA'
  );

export const addTokenMetadataAction = createAction<TokenMetadataInterface>('assets/ADD_TOKEN_METADATA');
export const removeTokenAction = createAction<string>('assets/REMOVE_TOKEN');
export const toggleTokenVisibilityAction = createAction<string>('assets/TOGGLE_TOKEN_VISIBILITY');

export const sendAssetActions = createActions<SendAssetActionPayloadInterface, string, string>('wallet/SEND_ASSET');
export const loadEstimationsActions =
  createActions<LoadEstimationsActionPayloadInterface, EstimationInterface[], string>('wallet/LOAD_ESTIMATIONS');

export const loadActivityGroupsActions = createActions<string, ActivityGroup[], string>('wallet/LOAD_ACTIVITY_GROUPS');
export const addPendingOperation = createAction<ActivityGroup>('wallet/ADD_PENDING_OPERATION');

export const approveInternalOperationRequestAction = createAction<WalletParamsWithKind[]>(
  'wallet/APPROVE_INTERNAL_OPERATION_REQUEST'
);
