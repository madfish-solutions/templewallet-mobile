import { createAction } from '@reduxjs/toolkit';

import { AccountInterface } from '../../interfaces/account.interface';
import { TokenBalanceInterface } from '../../token/interfaces/token-balance.interface';
import { createActions } from '../create-actions';

export const setSelectedAccountAction = createAction<string | undefined>('wallet/SET_SELECTED_ACCOUNT');
export const addHdAccountAction = createAction<AccountInterface>('wallet/ADD-HD-ACCOUNT');

export const loadTokenBalancesActions = createActions<string, TokenBalanceInterface[], string>('assets/LOAD_TOKENS');
export const loadTezosBalanceActions = createActions<string, string, string>('assets/LOAD_TEZOS');
