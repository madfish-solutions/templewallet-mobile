import { createAction } from '@reduxjs/toolkit';

import { AbortPermissionRequestActionPayloadInterface } from '../../interfaces/abort-permission-request-action-payload.interface';
import { AccountInterface } from '../../interfaces/account.interface';
import { ApprovePermissionRequestActionPayloadInterface } from '../../interfaces/approve-permission-request-action-payload.interface';
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

export const approvePermissionRequestAction = createAction<ApprovePermissionRequestActionPayloadInterface>(
  'wallet/APPROVE_PERMISSION_REQUEST'
);
export const abortPermissionRequestAction = createAction<AbortPermissionRequestActionPayloadInterface>(
  'wallet/ABORT_PERMISSION_REQUEST'
);
