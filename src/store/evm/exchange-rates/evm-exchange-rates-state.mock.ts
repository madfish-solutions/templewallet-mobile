import { mockPersistedState } from 'src/utils/redux';

import { EvmExchangeRatesState } from './evm-exchange-rates-state';

export const mockEvmExchangeRatesState = mockPersistedState<EvmExchangeRatesState>({
  record: {}
});
