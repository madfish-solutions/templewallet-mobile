import { createEntity } from '../create-entity';
import { CurrencyState } from './currency-state';

export const mockCurrencyState: CurrencyState = {
  exchangeRates: createEntity({}),
  quotes: createEntity({})
};
