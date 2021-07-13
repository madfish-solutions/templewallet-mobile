import { combineEpics } from 'redux-observable';
import { from, Observable, of, pipe } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { templeWalletApi } from '../../api.service';
import { RootState } from '../create-store';
import { loadExchangeRates } from './currency-actions';
import { TokenExchangeRate } from './currency-state';

export const loadExchangeRatesEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadExchangeRates.submit),
    withLatestFrom(state$, (_, state) => {
      return state.wallet.tokensMetadata;
    }),
    switchMap(tokensMetadata =>
      from(templeWalletApi.get<TokenExchangeRate[]>('exchange-rates')).pipe(
        map(({ data }) => {
          console.log({ tokensMetadata });
          const actualExchangeRates = data.filter(item => {
            return item.tokenId === 0;
          });

          return loadExchangeRates.success(data);
        }),
        catchError(err => of(loadExchangeRates.fail(err.message)))
      )
    )
  );

export const currencyEpics = combineEpics(loadExchangeRatesEpic);
