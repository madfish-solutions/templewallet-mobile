import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { loadTezosBalance$ } from 'src/utils/token-balance.utils';

import type { RootState } from '../types';

import { loadContactTezosBalance } from './contact-book-actions';

const loadContactTezosBalanceEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadContactTezosBalance.submit),
    toPayload(),
    withUserAnalyticsCredentials(state$),
    switchMap(([address, { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      loadTezosBalance$(address).pipe(
        map(tezosBalance => loadContactTezosBalance.success({ address, tezosBalance })),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('LoadContactTezosBalanceError', err, [address], { userId, ABTestingCategory });
          }

          return of(loadContactTezosBalance.fail(err.message));
        })
      )
    )
  );

export const contactsEpics = combineEpics(loadContactTezosBalanceEpic);
