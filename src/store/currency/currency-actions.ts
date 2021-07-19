import { createActions } from '../create-actions';
import { MappedTokenExchangeRate } from './currency-state';

export const loadExchangeRates = createActions<void, MappedTokenExchangeRate, string>('curenncy/LOAD_EXCHANGE_RATES');

export const loadTezosExchangeRate = createActions<void, number, string>('curenncy/LOAD_TEZOS_EXCHANGE_RATE');
