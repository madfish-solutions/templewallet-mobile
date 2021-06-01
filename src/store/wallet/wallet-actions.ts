import { createAction } from '@reduxjs/toolkit';

import { AccountInterface } from '../../interfaces/account.interface';
import { TokenTypeEnum } from '../../interfaces/token-type.enum';
import { TokenBalanceInterface } from '../../token/interfaces/token-balance.interface';
import { TokenMetadataInterface } from '../../token/interfaces/token-metadata.interface';
import { createActions } from '../create-actions';

export const setSelectedAccountAction = createAction<string | undefined>('wallet/SET_SELECTED_ACCOUNT');
export const addHdAccountAction = createAction<AccountInterface>('wallet/ADD-HD-ACCOUNT');

export const loadTokenBalancesActions =
  createActions<string, (TokenBalanceInterface & { token_type: TokenTypeEnum })[], string>('assets/LOAD_TOKENS');
export const loadTezosBalanceActions = createActions<string, string, string>('assets/LOAD_TEZOS');

export const loadTokenMetadataActions =
  createActions<Pick<TokenMetadataInterface, 'id' | 'address' | 'type'>, TokenMetadataInterface, string>(
    'assets/LOAD_TOKEN_METADATA'
  );

export const addTokenMetadataAction = createAction<TokenMetadataInterface>('wallet/ADD_TOKEN_METADATA');
