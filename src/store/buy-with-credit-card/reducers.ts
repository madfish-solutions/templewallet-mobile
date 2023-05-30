import { createReducer } from '@reduxjs/toolkit';

import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';

import { createEntity } from '../create-entity';
import { loadAllCurrenciesActions, updatePairLimitsActions, updateTopUpProviderPairLimitsAction } from './actions';
import { buyWithCreditCardInitialState, BuyWithCreditCardState } from './state';

export const buyWithCreditCardReducer = createReducer<BuyWithCreditCardState>(
  buyWithCreditCardInitialState,
  builder => {
    builder.addCase(loadAllCurrenciesActions.submit, state => ({
      ...state,
      currencies: {
        [TopUpProviderEnum.MoonPay]: createEntity(state.currencies[TopUpProviderEnum.MoonPay].data, true),
        [TopUpProviderEnum.Utorg]: createEntity(state.currencies[TopUpProviderEnum.Utorg].data, true),
        [TopUpProviderEnum.AliceBob]: createEntity(state.currencies[TopUpProviderEnum.AliceBob].data, true),
        [TopUpProviderEnum.BinanceConnect]: createEntity(state.currencies[TopUpProviderEnum.BinanceConnect].data, true)
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
        [TopUpProviderEnum.AliceBob]: createEntity(state.currencies[TopUpProviderEnum.AliceBob].data, false, error),
        [TopUpProviderEnum.BinanceConnect]: createEntity(
          state.currencies[TopUpProviderEnum.BinanceConnect].data,
          false,
          error
        )
      }
    }));

    builder.addCase(updatePairLimitsActions.submit, (state, { payload: { fiatSymbol, cryptoSymbol } }) => {
      const previousEntities = state.pairLimits[fiatSymbol]?.[cryptoSymbol];

      return {
        ...state,
        pairLimits: {
          ...state.pairLimits,
          [fiatSymbol]: {
            ...(state.pairLimits[fiatSymbol] ?? {}),
            [cryptoSymbol]: {
              [TopUpProviderEnum.MoonPay]: createEntity(previousEntities?.[TopUpProviderEnum.MoonPay]?.data, true),
              [TopUpProviderEnum.Utorg]: createEntity(previousEntities?.[TopUpProviderEnum.Utorg]?.data, true),
              [TopUpProviderEnum.AliceBob]: createEntity(previousEntities?.[TopUpProviderEnum.AliceBob]?.data, true),
              [TopUpProviderEnum.BinanceConnect]: createEntity(
                previousEntities?.[TopUpProviderEnum.BinanceConnect]?.data,
                true
              )
            }
          }
        }
      };
    });

    builder.addCase(updatePairLimitsActions.success, (state, { payload: { fiatSymbol, cryptoSymbol, limits } }) => ({
      ...state,
      pairLimits: {
        ...state.pairLimits,
        [fiatSymbol]: {
          ...(state.pairLimits[fiatSymbol] ?? {}),
          [cryptoSymbol]: {
            [TopUpProviderEnum.MoonPay]: createEntity(
              limits[TopUpProviderEnum.MoonPay].data,
              false,
              limits[TopUpProviderEnum.MoonPay].error
            ),
            [TopUpProviderEnum.Utorg]: createEntity(
              limits[TopUpProviderEnum.Utorg].data,
              false,
              limits[TopUpProviderEnum.Utorg].error
            ),
            [TopUpProviderEnum.AliceBob]: createEntity(
              limits[TopUpProviderEnum.AliceBob].data,
              false,
              limits[TopUpProviderEnum.AliceBob].error
            ),
            [TopUpProviderEnum.BinanceConnect]: createEntity(
              limits[TopUpProviderEnum.BinanceConnect].data,
              false,
              limits[TopUpProviderEnum.BinanceConnect].error
            )
          }
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
              ),
              [TopUpProviderEnum.BinanceConnect]: createEntity(
                previousEntities?.[TopUpProviderEnum.BinanceConnect]?.data,
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
