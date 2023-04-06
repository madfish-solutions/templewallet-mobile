import { createActions } from '../create-actions';
import { BuyWithCreditCardState } from './state';

export const loadAllCurrenciesActions = createActions<void, BuyWithCreditCardState['currencies'], string>(
  'buy-with-credit-card/LOAD_ALL_CURRENCIES'
);
