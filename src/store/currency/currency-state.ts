import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type TokenExchangeRateRecord = Record<string, number>;

export interface ExchangeRatesState {
  tokensExchangeRates: LoadableEntityState<TokenExchangeRateRecord>;
}

export const currencyInitialState: ExchangeRatesState = {
  tokensExchangeRates: createEntity({})
};

export interface CurrencyRootState {
  currency: ExchangeRatesState;
}
