import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type ExchangeRateRecord = Record<string, number>;

export interface ExchangeRatesState {
  exchangeRates: LoadableEntityState<ExchangeRateRecord>;
}

export const currencyInitialState: ExchangeRatesState = {
  exchangeRates: createEntity({})
};

export interface CurrencyRootState {
  currency: ExchangeRatesState;
}
