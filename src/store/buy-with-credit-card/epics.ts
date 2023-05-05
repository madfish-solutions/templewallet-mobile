import { combineEpics } from 'redux-observable';
import { catchError, forkJoin, from, map, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { getTezUahPairInfo } from 'src/apis/alice-bob';
import { fetchMoonpayCryptoCurrencies$, fetchMoonpayFiatCurrencies$ } from 'src/apis/moonpay/apollo';
import { getCurrenciesInfo as getUtorgCurrenciesInfo } from 'src/apis/utorg';
import { TopUpProviderEnum } from 'src/enums/top-up-providers.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import { isDefined } from 'src/utils/is-defined';

import { createEntity } from '../create-entity';
import { loadAllCurrenciesActions } from './actions';
import { TopUpProviderCurrencies } from './state';
import { mapAliceBobProviderCurrencies, mapMoonPayProviderCurrencies, mapUtorgProviderCurrencies } from './utils';

const getCurrencies$ = <T>(
  fetchFn: () => Observable<T>,
  transformFn: (data: T) => TopUpProviderCurrencies,
  errorMessageFn?: (err: Error) => string
) =>
  fetchFn().pipe(
    map(data => createEntity(transformFn(data))),
    catchError(err => {
      if (isDefined(errorMessageFn)) {
        showErrorToast({ description: errorMessageFn(err) });
      }

      return of(createEntity<TopUpProviderCurrencies>({ fiat: [], crypto: [] }, err.message));
    })
  );

const loadAllCurrenciesEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadAllCurrenciesActions.submit),
    switchMap(() =>
      forkJoin([
        getCurrencies$(
          () => forkJoin([fetchMoonpayFiatCurrencies$(), fetchMoonpayCryptoCurrencies$()]),
          mapMoonPayProviderCurrencies,
          err => `Failed to load Moonpay currencies: ${err.message}`
        ),
        getCurrencies$(
          () => from(getUtorgCurrenciesInfo()),
          mapUtorgProviderCurrencies,
          err => `Failed to load Utorg currencies: ${err.message}`
        ),
        getCurrencies$(() => from(getTezUahPairInfo()), mapAliceBobProviderCurrencies)
      ]).pipe(
        map(([moonpayCurrencies, utorgCurrencies, tezUahPairInfo]) =>
          loadAllCurrenciesActions.success({
            [TopUpProviderEnum.MoonPay]: moonpayCurrencies,
            [TopUpProviderEnum.Utorg]: utorgCurrencies,
            [TopUpProviderEnum.AliceBob]: tezUahPairInfo
          })
        )
      )
    )
  );

export const buyWithCreditCardEpics = combineEpics(loadAllCurrenciesEpic);
