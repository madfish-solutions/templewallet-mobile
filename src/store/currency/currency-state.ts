import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type ExchangeRateRecord = Record<string, number>;

export interface CurrencyState {
  exchangeRates: LoadableEntityState<ExchangeRateRecord>;
  quotes: LoadableEntityState<ExchangeRateRecord>;
}

export const currencyInitialState: CurrencyState = {
  exchangeRates: createEntity({}),
  quotes: createEntity({})
};

export interface CurrencyRootState {
  currency: CurrencyState;
}
