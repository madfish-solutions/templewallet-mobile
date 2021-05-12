import { createAction } from '@reduxjs/toolkit';

import { AccountInterface } from '../../interfaces/account.interface';

export const setSelectedAccount = createAction<string | undefined>('wallet/SET_SELECTED_ACCOUNT');

export const addHdAccount = createAction<AccountInterface>('wallet/ADD-HD-ACCOUNT');
