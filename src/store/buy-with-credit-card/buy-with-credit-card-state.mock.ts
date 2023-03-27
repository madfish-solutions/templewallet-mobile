import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';

import { createEntity } from '../create-entity';
import { BuyWithCreditCardState } from './buy-with-credit-card-state';

export const mockBuyWithCreditCardState: BuyWithCreditCardState = {
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
