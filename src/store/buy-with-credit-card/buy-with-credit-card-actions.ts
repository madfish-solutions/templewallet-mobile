import { TopUpInputInterface, TopUpOutputInterface } from 'src/interfaces/topup.interface';
import { LocationResponse } from 'src/utils/moonpay.utils';

import { createActions } from '../create-actions';
import { TopUpProviderCurrencies } from './buy-with-credit-card-state';

export const loadMoonPayFiatCurrenciesActions = createActions<void, Array<TopUpInputInterface>, string>(
  'buy-with-credit-card/LOAD_MOONPAY_FIAT_CURRENCIES'
);
export const loadMoonPayCryptoCurrenciesActions = createActions<void, Array<TopUpOutputInterface>, string>(
  'buy-with-credit-card/LOAD_MOONPAY_CRYPTO_CURRENCIES'
);
export const loadUtorgCurrenciesActions = createActions<void, TopUpProviderCurrencies, string>(
  'buy-with-credit-card/LOAD_UTORG_CURRENCIES'
);
export const loadAliceBobCurrenciesActions = createActions<void, TopUpProviderCurrencies, string>(
  'buy-with-credit-card/LOAD_ALICE_BOB_CURRENCIES'
);
export const loadLocationActions = createActions<void, LocationResponse, string>('buy-with-credit-card/LOAD_LOCATION');
