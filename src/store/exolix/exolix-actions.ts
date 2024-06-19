import { createAction } from '@reduxjs/toolkit';

import { TopUpWithNetworkInterface } from 'src/interfaces/topup.interface';
import { ExchangeDataInterface, SubmitExchangePayload } from 'src/types/exolix.types';

import { createActions } from '../create-actions';

export const setExolixStepAction = createAction<number>('exolix/SET_STEP');

export const loadExolixCurrenciesAction = createActions<void, TopUpWithNetworkInterface[], void>(
  'exolix/LOAD_CURRENCIES'
);
export const loadExolixExchangeDataActions = createActions<SubmitExchangePayload, ExchangeDataInterface | null, void>(
  'exolix/LOAD_EXCHANGE_DATA'
);

export const refreshExolixExchangeDataAction = createAction<string>('exolix/REFRESH_EXCHANGE_DATA');

export const restartExolixTopupAction = createAction<void>('exolix/RESTART_TOPUP');
