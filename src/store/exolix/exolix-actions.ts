import { createAction } from '@reduxjs/toolkit';

import { ExchangeDataInterface, SubmitExchangePayload } from 'src/interfaces/exolix.interface';
import { ExolixTopUpInputInterface } from 'src/screens/buy/crypto/exolix/exolix-topup.form';

import { createActions } from '../create-actions';

export const setExolixStepAction = createAction<number>('exolix/SET_STEP');

export const loadExolixCurrenciesAction = createActions<void, ExolixTopUpInputInterface[], void>(
  'exolix/LOAD_CURRENCIES'
);
export const loadExolixExchangeDataActions = createActions<SubmitExchangePayload, ExchangeDataInterface | null, void>(
  'exolix/LOAD_EXCHANGE_DATA'
);

export const refreshExolixExchangeDataAction = createAction<string>('exolix/REFRESH_EXCHANGE_DATA');

export const restartExolixTopupAction = createAction<void>('exolix/RESTART_TOPUP');
