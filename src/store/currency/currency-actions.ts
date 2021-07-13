import { createActions } from '../create-actions';
import { TokenExchangeRate } from './currency-state';

export const loadExchangeRates = createActions<void, TokenExchangeRate[], string>('curenncy/LOAD_EXCHANGE_RATES');
