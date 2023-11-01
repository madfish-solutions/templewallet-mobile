import { createEntity } from '../create-entity';

import { CurrencyState } from './currency-state';

export const mockCurrencyState: CurrencyState = {
  usdToTokenRates: createEntity({}),
  fiatToTezosRates: createEntity({})
};
