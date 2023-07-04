import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type ExchangeRateRecord = Record<string, number>;

export interface CurrencyState {
  usdToTokenRates: LoadableEntityState<ExchangeRateRecord>;
  fiatToTezosRates: LoadableEntityState<ExchangeRateRecord>;
}

export const currencyInitialState: CurrencyState = {
  usdToTokenRates: createEntity({}),
  fiatToTezosRates: createEntity({})
};
