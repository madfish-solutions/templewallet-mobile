import { createActions } from '../create-actions';
import { ExchangeRateRecord } from './currency-state';

interface ExchangeRateInterface {
  exchangeRates: ExchangeRateRecord;
  quotes: ExchangeRateRecord;
}

export const loadExchangeRates = createActions<void, ExchangeRateInterface, string>('curenncy/LOAD_EXCHANGE_RATES');
