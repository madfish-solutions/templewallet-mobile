import { createReducer } from '@reduxjs/toolkit';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';

import { loadAllCurrenciesActions, updatePairLimitsActions, updateTopUpProviderPairLimitsAction } from './actions';
import { buyWithCreditCardInitialState, BuyWithCreditCardState } from './state';

export const buyWithCreditCardReducer = createReducer<BuyWithCreditCardState>(
  buyWithCreditCardInitialState,
  builder => {
    builder.addCase(loadAllCurrenciesActions.submit, state => {
      state.currencies[TopUpProviderEnum.MoonPay].isLoading = true;
      state.currencies[TopUpProviderEnum.Utorg].isLoading = true;
      state.currencies[TopUpProviderEnum.AliceBob].isLoading = true;
    });

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

    builder.addCase(updatePairLimitsActions.submit, (state, { payload: { fiatSymbol, cryptoSymbol } }) => {
      if (!isDefined(state.pairLimits[fiatSymbol])) {
        state.pairLimits[fiatSymbol] = {};
      }

      const dataPerFiat = state.pairLimits[fiatSymbol];

      if (isDefined(dataPerFiat[cryptoSymbol])) {
        const dataPerFiatPerCrypto = dataPerFiat[cryptoSymbol];
        const updatePerProvider = (providerId: TopUpProviderEnum) => {
          dataPerFiatPerCrypto[providerId].isLoading = true;
        };

        updatePerProvider(TopUpProviderEnum.MoonPay);
        updatePerProvider(TopUpProviderEnum.Utorg);
        updatePerProvider(TopUpProviderEnum.AliceBob);
      } else {
        dataPerFiat[cryptoSymbol] = {
          [TopUpProviderEnum.MoonPay]: createEntity(undefined, true),
          [TopUpProviderEnum.Utorg]: createEntity(undefined, true),
          [TopUpProviderEnum.AliceBob]: createEntity(undefined, true)
        };
      }
    });

    builder.addCase(updatePairLimitsActions.success, (state, { payload: { fiatSymbol, cryptoSymbol, limits } }) => ({
      ...state,
      pairLimits: {
        ...state.pairLimits,
        [fiatSymbol]: {
          ...(state.pairLimits[fiatSymbol] ?? {}),
          [cryptoSymbol]: limits // They come with `isLoading === false`
        }
      }
    }));

    builder.addCase(updatePairLimitsActions.fail, (state, { payload: { fiatSymbol, cryptoSymbol, error } }) => {
      const previousEntities = state.pairLimits[fiatSymbol]?.[cryptoSymbol];

      return {
        ...state,
        pairLimits: {
          ...state.pairLimits,
          [fiatSymbol]: {
            ...(state.pairLimits[fiatSymbol] ?? {}),
            [cryptoSymbol]: {
              [TopUpProviderEnum.MoonPay]: createEntity(
                previousEntities?.[TopUpProviderEnum.MoonPay]?.data,
                false,
                error
              ),
              [TopUpProviderEnum.Utorg]: createEntity(previousEntities?.[TopUpProviderEnum.Utorg]?.data, false, error),
              [TopUpProviderEnum.AliceBob]: createEntity(
                previousEntities?.[TopUpProviderEnum.AliceBob]?.data,
                false,
                error
              )
            }
          }
        }
      };
    });

    builder.addCase(
      updateTopUpProviderPairLimitsAction,
      (state, { payload: { fiatSymbol, cryptoSymbol, topUpProvider, value } }) => ({
        ...state,
        pairLimits: {
          ...state.pairLimits,
          [fiatSymbol]: {
            ...(state.pairLimits[fiatSymbol] ?? {}),
            [cryptoSymbol]: {
              ...(state.pairLimits[fiatSymbol]?.[cryptoSymbol] ?? {}),
              [topUpProvider]: createEntity(value)
            }
          }
        }
      })
    );
  }
);
