import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PairLimits } from 'src/utils/pair-limits';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';
import { TopUpInputInterface, TopUpOutputInterface } from './types';

export interface TopUpProviderCurrencies {
  fiat: TopUpInputInterface[];
  crypto: TopUpOutputInterface[];
}

export type PairLimitsRecord = Record<TopUpProviderEnum, LoadableEntityState<PairLimits | undefined>>;

export interface BuyWithCreditCardState {
  currencies: Record<TopUpProviderEnum, LoadableEntityState<TopUpProviderCurrencies>>;
  pairLimits: Record<string, Record<string, PairLimitsRecord>>;
}

export const buyWithCreditCardInitialState: BuyWithCreditCardState = {
  currencies: {
    [TopUpProviderEnum.MoonPay]: createEntity({ fiat: [], crypto: [] }),
    [TopUpProviderEnum.Utorg]: createEntity({ fiat: [], crypto: [] }),
    [TopUpProviderEnum.AliceBob]: createEntity({ fiat: [], crypto: [] })
  },
  pairLimits: {}
};
