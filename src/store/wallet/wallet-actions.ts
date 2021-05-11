import { createAction } from '@reduxjs/toolkit';

import { AccountInterface } from '../../interfaces/account.interface';

export const addHdAccount = createAction<AccountInterface>('wallet/ADD-HD-ACCOUNT');
export const setSelectedAccount = createAction<AccountInterface>('wallet/SET_SELECTED_ACCOUNT');
