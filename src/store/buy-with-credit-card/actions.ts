import { createAction } from '@reduxjs/toolkit';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { PairLimits } from 'src/utils/pair-limits';

import { createActions } from '../create-actions';

import { BuyWithCreditCardState, PairLimitsRecord } from './state';

export const loadAllCurrenciesActions = createActions<void, BuyWithCreditCardState['currencies'], string>(
  'buy-with-credit-card/LOAD_ALL_CURRENCIES'
);
export const updatePairLimitsActions = createActions<
  { fiatSymbol: string; cryptoSymbol: string },
  {
    fiatSymbol: string;
    cryptoSymbol: string;
    limits: PairLimitsRecord;
  },
  { fiatSymbol: string; cryptoSymbol: string; error: string }
>('buy-with-credit-card/UPDATE_PAIR_LIMITS');
export const updateTopUpProviderPairLimitsAction = createAction<{
  fiatSymbol: string;
  cryptoSymbol: string;
  topUpProvider: TopUpProviderEnum;
  value: PairLimits;
}>('buy-with-credit-card/UPDATE_TOP_UP_PROVIDER_PAIR_LIMITS');
