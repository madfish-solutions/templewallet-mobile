import { createReducer } from '@reduxjs/toolkit';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';

import { createEntity } from '../create-entity';
import { loadAllCurrenciesActions } from './actions';
import { buyWithCreditCardInitialState, BuyWithCreditCardState } from './state';

export const buyWithCreditCardReducer = createReducer<BuyWithCreditCardState>(
  buyWithCreditCardInitialState,
  builder => {
    builder.addCase(loadAllCurrenciesActions.submit, state => ({
      ...state,
      currencies: {
        [TopUpProviderEnum.MoonPay]: createEntity(state.currencies[TopUpProviderEnum.MoonPay].data, true),
        [TopUpProviderEnum.Utorg]: createEntity(state.currencies[TopUpProviderEnum.Utorg].data, true),
        [TopUpProviderEnum.AliceBob]: createEntity(state.currencies[TopUpProviderEnum.AliceBob].data, true)
      }
    }));

    builder.addCase(loadAllCurrenciesActions.success, (state, { payload: currencies }) => ({
      ...state,
      currencies
    }));

    builder.addCase(loadAllCurrenciesActions.fail, (state, { payload: error }) => ({
      ...state,
      currencies: {
        [TopUpProviderEnum.MoonPay]: createEntity(state.currencies[TopUpProviderEnum.MoonPay].data, false, error),
        [TopUpProviderEnum.Utorg]: createEntity(state.currencies[TopUpProviderEnum.Utorg].data, false, error),
        [TopUpProviderEnum.AliceBob]: createEntity(state.currencies[TopUpProviderEnum.AliceBob].data, false, error)
      }
    }));
  }
);
