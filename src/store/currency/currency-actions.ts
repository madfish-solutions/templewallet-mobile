import { createActions } from '../create-actions';

import { ExchangeRateRecord } from './currency-state';

interface ExchangeRateInterface {
  usdToTokenRates: ExchangeRateRecord;
  fiatToTezosRates: ExchangeRateRecord;
}

export const loadExchangeRates = createActions<void, ExchangeRateInterface, string>('curenncy/LOAD_EXCHANGE_RATES');
