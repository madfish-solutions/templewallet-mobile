import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { TopUpInputInterface, TopUpOutputInterface } from 'src/interfaces/topup.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export interface TopUpProviderCurrencies {
  fiat: TopUpInputInterface[];
  crypto: TopUpOutputInterface[];
}

export interface BuyWithCreditCardState {
  currencies: Record<TopUpProviderEnum, LoadableEntityState<TopUpProviderCurrencies>>;
}

export const buyWithCreditCardInitialState: BuyWithCreditCardState = {
  currencies: {
    [TopUpProviderEnum.MoonPay]: createEntity({ fiat: [], crypto: [] }),
    [TopUpProviderEnum.Utorg]: createEntity({ fiat: [], crypto: [] }),
    [TopUpProviderEnum.AliceBob]: createEntity({ fiat: [], crypto: [] })
  }
};

export interface BuyWithCreditCardRootState {
  buyWithCreditCard: BuyWithCreditCardState;
}
