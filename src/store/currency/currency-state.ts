import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface TokenExchangeRate {
  tokenAddress: string;
  tokenId?: number;
  exchangeRate: string;
}

export interface tokenExchangeRatesState {
  tokenExchangeRates: LoadableEntityState<TokenExchangeRate[]>;
}

export const currencyInitialState: tokenExchangeRatesState = {
  tokenExchangeRates: createEntity([])
};

export interface CurrencyRootState {
  currency: tokenExchangeRatesState;
}
