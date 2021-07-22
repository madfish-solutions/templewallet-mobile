import { createAction } from '@reduxjs/toolkit';

import { createActions } from '../create-actions';
import { TokenExchangeRateRecord } from './currency-state';

export const loadExchangeRates = createActions<void, TokenExchangeRateRecord, string>('curenncy/LOAD_EXCHANGE_RATES');

export const loadTezosExchangeRate = createAction<number>('curenncy/LOAD_TEZOS_EXCHANGE_RATE');
