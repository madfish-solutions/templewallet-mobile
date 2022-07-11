import { createAction } from '@reduxjs/toolkit';

import { CurrenciesInterface, ExchangeDataInterface, ExchangePayload } from '../../interfaces/exolix.interface';
import { createActions } from '../create-actions';

export const setExolixStepAction = createAction<number>('exolix/SET_STEP');

export const loadExolixCurrenciesAction = createActions<void, Array<CurrenciesInterface>, void>(
  'exolix/LOAD_CURRENCIES'
);
export const loadExolixExchangeDataActions = createActions<ExchangePayload, ExchangeDataInterface | null, void>(
  'exolix/LOAD_EXCHANGE_DATA'
);

export const refreshExolixExchangeDataAction = createAction<string>('exolix/REFRESH_EXCHANGE_DATA');

export const restartExolixTopupAction = createAction<void>('exolix/RESTART_TOPUP');
