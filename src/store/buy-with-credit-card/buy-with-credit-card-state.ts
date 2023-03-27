import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { TopUpInputInterface, TopUpOutputInterface } from 'src/interfaces/topup.interface';
import { LocationResponse } from 'src/utils/moonpay.utils';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface TopUpProviderCurrencies {
  fiat: TopUpInputInterface[];
  crypto: TopUpOutputInterface[];
}

export interface BuyWithCreditCardState {
  currencies: Record<TopUpProviderEnum, LoadableEntityState<TopUpProviderCurrencies>>;
  location: LoadableEntityState<LocationResponse>;
}

export const buyWithCreditCardInitialState: BuyWithCreditCardState = {
  currencies: {
    [TopUpProviderEnum.MoonPay]: createEntity({ fiat: [], crypto: [] }),
    [TopUpProviderEnum.Utorg]: createEntity({ fiat: [], crypto: [] }),
    [TopUpProviderEnum.AliceBob]: createEntity({ fiat: [], crypto: [] })
  },
  location: createEntity({
    alpha2: '',
    alpha3: '',
    country: '',
    ipAddress: '',
    isAllowed: true,
    isBuyAllowed: true
  })
};

export interface BuyWithCreditCardRootState {
  buyWithCreditCard: BuyWithCreditCardState;
}
