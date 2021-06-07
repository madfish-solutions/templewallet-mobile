import { createAction } from '@reduxjs/toolkit';

import { AccountInterface } from '../../interfaces/account.interface';
import { OperationErrorPayload } from '../../interfaces/operation-error-payload';
import { OperationSuccessPayload } from '../../interfaces/operation-success-payload';
import { TokenBalanceInterface } from '../../token/interfaces/token-balance.interface';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { createActions } from '../create-actions';

export const setSelectedAccountAction = createAction<string | undefined>('wallet/SET_SELECTED_ACCOUNT');
export const addHdAccountAction = createAction<AccountInterface>('wallet/ADD-HD-ACCOUNT');
export const removeSendingErrorAction = createAction('wallet/REMOVE_SENDING_ERROR');

export const confirmationActions =
  createActions<OperationSuccessPayload, OperationSuccessPayload, OperationErrorPayload>('wallet/OP_CONFIRMATION');
export const removeConfirmationSuccessAction = createAction<string>('wallet/REMOVE_CONFIRMATION_SUCCESS');
export const removeConfirmationErrorAction = createAction<string>('wallet/REMOVE_CONFIRMATION_ERROR');

export const loadTokenBalancesActions = createActions<string, TokenBalanceInterface[], string>('assets/LOAD_TOKENS');
export const loadTezosBalanceActions = createActions<string, string, string>('assets/LOAD_TEZOS');

export const loadTokenMetadataActions =
  createActions<Pick<TokenMetadataInterface, 'id' | 'address'>, TokenMetadataInterface, string>(
    'assets/LOAD_TOKEN_METADATA'
  );

export const addTokenMetadataAction = createAction<TokenMetadataInterface>('wallet/ADD_TOKEN_METADATA');
export const removeTokenAction = createAction<string>('wallet/REMOVE_TOKEN');
export const toggleTokenVisibilityAction = createAction<string>('wallet/TOGGLE_TOKEN_VISIBILITY');
