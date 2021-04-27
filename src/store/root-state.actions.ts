import { createAction } from '@reduxjs/toolkit';

import { SendInterface } from './types';

export const rootStateResetAction = createAction('root/RESET');
export const keychainResetSuccessAction = createAction('keychain/RESET-SUCCESS');
export const sendAction = createAction<SendInterface>('root/SEND');
