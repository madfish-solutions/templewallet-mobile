import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
  ActionReducerMapBuilder,
  createReducer
} from '@reduxjs/toolkit';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';

import { createEntity } from '../create-entity';
import {
  loadAliceBobCurrenciesActions,
  loadLocationActions,
  loadMoonPayCryptoCurrenciesActions,
  loadMoonPayFiatCurrenciesActions,
  loadUtorgCurrenciesActions
} from './buy-with-credit-card-actions';
import {
  buyWithCreditCardInitialState,
  BuyWithCreditCardState,
  TopUpProviderCurrencies
} from './buy-with-credit-card-state';

const addMoonPayCases = <T extends keyof TopUpProviderCurrencies>(
  builder: ActionReducerMapBuilder<BuyWithCreditCardState>,
  currenciesType: T,
  actions: {
    submit: ActionCreatorWithoutPayload<string>;
    success: ActionCreatorWithPayload<TopUpProviderCurrencies[T], string>;
    fail: ActionCreatorWithPayload<string>;
  }
) => {
  builder.addCase(actions.submit, state => ({
    ...state,
    currencies: {
      ...state.currencies,
      [TopUpProviderEnum.MoonPay]: createEntity(state.currencies[TopUpProviderEnum.MoonPay].data, true)
    }
  }));
  builder.addCase(actions.success, (state, { payload: currencies }) => ({
    ...state,
    currencies: {
      ...state.currencies,
      [TopUpProviderEnum.MoonPay]: createEntity({
        ...state.currencies[TopUpProviderEnum.MoonPay].data,
        [currenciesType]: currencies
      })
    }
  }));
  builder.addCase(actions.fail, (state, { payload: error }) => ({
    ...state,
    currencies: {
      ...state.currencies,
      [TopUpProviderEnum.MoonPay]: createEntity(state.currencies[TopUpProviderEnum.MoonPay].data, false, error)
    }
  }));
};

const addOneActionAllCurrenciesTypesCases = (
  builder: ActionReducerMapBuilder<BuyWithCreditCardState>,
  provider: TopUpProviderEnum,
  actions: {
    submit: ActionCreatorWithoutPayload<string>;
    success: ActionCreatorWithPayload<TopUpProviderCurrencies, string>;
    fail: ActionCreatorWithPayload<string>;
  }
) => {
  builder.addCase(actions.submit, state => ({
    ...state,
    currencies: {
      ...state.currencies,
      [provider]: createEntity(state.currencies[provider].data, true)
    }
  }));
  builder.addCase(actions.success, (state, { payload: currencies }) => ({
    ...state,
    currencies: {
      ...state.currencies,
      [provider]: createEntity(currencies)
    }
  }));
  builder.addCase(actions.fail, (state, { payload: error }) => ({
    ...state,
    currencies: {
      ...state.currencies,
      [provider]: createEntity(state.currencies[provider].data, false, error)
    }
  }));
};

export const buyWithCreditCardReducers = createReducer<BuyWithCreditCardState>(
  buyWithCreditCardInitialState,
  builder => {
    addMoonPayCases(builder, 'fiat', loadMoonPayFiatCurrenciesActions);
    addMoonPayCases(builder, 'crypto', loadMoonPayCryptoCurrenciesActions);

    addOneActionAllCurrenciesTypesCases(builder, TopUpProviderEnum.Utorg, loadUtorgCurrenciesActions);
    addOneActionAllCurrenciesTypesCases(builder, TopUpProviderEnum.AliceBob, loadAliceBobCurrenciesActions);

    builder.addCase(loadLocationActions.submit, state => ({
      ...state,
      location: createEntity(state.location.data, true)
    }));
    builder.addCase(loadLocationActions.success, (state, { payload: location }) => ({
      ...state,
      location: createEntity(location)
    }));
    builder.addCase(loadLocationActions.fail, (state, { payload: error }) => ({
      ...state,
      location: createEntity(state.location.data, false, error)
    }));
  }
);
