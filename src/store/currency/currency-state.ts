import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type ExchangeRateRecord = Record<string, number>;

export interface CurrencyState {
  exchangeRates: LoadableEntityState<ExchangeRateRecord>;
}

export const currencyInitialState: CurrencyState = {
  exchangeRates: createEntity({})
};

export interface CurrencyRootState {
  currency: CurrencyState;
}
