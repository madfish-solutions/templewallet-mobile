import { createActions } from '../create-actions';
import { ExchangeRateRecord } from './currency-state';

export const loadExchangeRates = createActions<void, ExchangeRateRecord, string>('curenncy/LOAD_EXCHANGE_RATES');
