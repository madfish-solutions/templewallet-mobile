import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface TokenExchangeRate {
  tokenAddress: string;
  tokenId?: number;
  exchangeRate: string;
}

export interface MappedTokenExchangeRate {
  [key: string]: number;
}

export interface exchangeRatesState {
  tezosExchangeRate: LoadableEntityState<number>;
  tokensExchangeRates: LoadableEntityState<MappedTokenExchangeRate>;
}

export const currencyInitialState: exchangeRatesState = {
  tezosExchangeRate: createEntity(0),
  tokensExchangeRates: createEntity({})
};

export interface CurrencyRootState {
  currency: exchangeRatesState;
}
