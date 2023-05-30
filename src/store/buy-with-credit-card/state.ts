import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { TopUpInterfaceBase, TopUpProviderPairLimits } from 'src/interfaces/topup.interface';

import { createEntity } from '../create-entity';
import { LoadableEntityState } from '../types';

export type BuyWithCreditCardTopUpInputInterface = TopUpInterfaceBase;

export interface BuyWithCreditCardTopUpOutputInterface extends TopUpInterfaceBase {
  slug: string;
}

export interface TopUpProviderCurrencies {
  fiat: BuyWithCreditCardTopUpInputInterface[];
  crypto: BuyWithCreditCardTopUpOutputInterface[];
}

export type PairLimits = Record<TopUpProviderEnum, LoadableEntityState<TopUpProviderPairLimits | undefined>>;

export interface BuyWithCreditCardState {
  currencies: Record<TopUpProviderEnum, LoadableEntityState<TopUpProviderCurrencies>>;
  pairLimits: Record<string, Record<string, PairLimits>>;
}

export const buyWithCreditCardInitialState: BuyWithCreditCardState = {
  currencies: {
    [TopUpProviderEnum.MoonPay]: createEntity({ fiat: [], crypto: [] }),
    [TopUpProviderEnum.Utorg]: createEntity({ fiat: [], crypto: [] }),
    [TopUpProviderEnum.AliceBob]: createEntity({ fiat: [], crypto: [] }),
    [TopUpProviderEnum.BinanceConnect]: createEntity({ fiat: [], crypto: [] })
  },
  pairLimits: {}
};

export interface BuyWithCreditCardRootState {
  buyWithCreditCard: BuyWithCreditCardState;
}
