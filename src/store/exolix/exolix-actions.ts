import { createAction } from '@reduxjs/toolkit';

import { ExchangeDataInterface, SubmitExchangePayload } from '../../interfaces/exolix.interface';
import { TopUpInputInterface } from '../../interfaces/topup.interface';
import { createActions } from '../create-actions';

export const setExolixStepAction = createAction<number>('exolix/SET_STEP');

export const loadExolixCurrenciesAction = createActions<void, Array<TopUpInputInterface>, void>(
  'exolix/LOAD_CURRENCIES'
);
export const loadExolixExchangeDataActions = createActions<SubmitExchangePayload, ExchangeDataInterface | null, void>(
  'exolix/LOAD_EXCHANGE_DATA'
);

export const refreshExolixExchangeDataAction = createAction<string>('exolix/REFRESH_EXCHANGE_DATA');

export const restartExolixTopupAction = createAction<void>('exolix/RESTART_TOPUP');
