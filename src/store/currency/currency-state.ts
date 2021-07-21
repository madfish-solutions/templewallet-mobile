import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type TokenExchangeRateRecord = Record<string, number>;

export interface ExchangeRatesState {
  tezosExchangeRate: LoadableEntityState<number>;
  tokensExchangeRates: LoadableEntityState<TokenExchangeRateRecord>;
}

export const currencyInitialState: ExchangeRatesState = {
  tezosExchangeRate: createEntity(0),
  tokensExchangeRates: createEntity({})
};

export interface CurrencyRootState {
  currency: ExchangeRatesState;
}
