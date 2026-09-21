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
      state.currencies[TopUpProviderEnum.MtPelerin].isLoading = true;
    });

    builder.addCase(loadAllCurrenciesActions.success, (state, { payload: currencies }) => ({
      ...state,
      currencies
    }));

    builder.addCase(loadAllCurrenciesActions.fail, (state, { payload: error }) => ({
      ...state,
      currencies: {
        [TopUpProviderEnum.MoonPay]: createEntity(state.currencies[TopUpProviderEnum.MoonPay].data, false, error),
        [TopUpProviderEnum.MtPelerin]: createEntity(state.currencies[TopUpProviderEnum.MtPelerin].data, false, error)
      }
    }));

    builder.addCase(updatePairLimitsActions.submit, (state, { payload: { fiatSymbol, cryptoSlug } }) => {
      if (!isDefined(state.pairLimits[fiatSymbol])) {
        state.pairLimits[fiatSymbol] = {};
      }

      const dataPerFiat = state.pairLimits[fiatSymbol];

      if (isDefined(dataPerFiat[cryptoSlug])) {
        const dataPerFiatPerCrypto = dataPerFiat[cryptoSlug];
        const updatePerProvider = (providerId: TopUpProviderEnum) => {
          dataPerFiatPerCrypto[providerId].isLoading = true;
        };

        updatePerProvider(TopUpProviderEnum.MoonPay);
        updatePerProvider(TopUpProviderEnum.MtPelerin);
      } else {
        dataPerFiat[cryptoSlug] = {
          [TopUpProviderEnum.MoonPay]: createEntity(undefined, true),
          [TopUpProviderEnum.MtPelerin]: createEntity(undefined, true)
        };
      }
    });

    builder.addCase(updatePairLimitsActions.success, (state, { payload: { fiatSymbol, cryptoSlug, limits } }) => ({
      ...state,
      pairLimits: {
        ...state.pairLimits,
        [fiatSymbol]: {
          ...(state.pairLimits[fiatSymbol] ?? {}),
          [cryptoSlug]: limits // They come with `isLoading === false`
        }
      }
    }));

    builder.addCase(updatePairLimitsActions.fail, (state, { payload: { fiatSymbol, cryptoSlug, error } }) => {
      const previousEntities = state.pairLimits[fiatSymbol]?.[cryptoSlug];

      return {
        ...state,
        pairLimits: {
          ...state.pairLimits,
          [fiatSymbol]: {
            ...(state.pairLimits[fiatSymbol] ?? {}),
            [cryptoSlug]: {
              [TopUpProviderEnum.MoonPay]: createEntity(
                previousEntities?.[TopUpProviderEnum.MoonPay]?.data,
                false,
                error
              ),
              [TopUpProviderEnum.MtPelerin]: createEntity(
                previousEntities?.[TopUpProviderEnum.MtPelerin]?.data,
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
      (state, { payload: { fiatSymbol, cryptoSlug, topUpProvider, value } }) => ({
        ...state,
        pairLimits: {
          ...state.pairLimits,
          [fiatSymbol]: {
            ...(state.pairLimits[fiatSymbol] ?? {}),
            [cryptoSlug]: {
              ...(state.pairLimits[fiatSymbol]?.[cryptoSlug] ?? {}),
              [topUpProvider]: createEntity(value)
            }
          }
        }
      })
    );
  }
);
