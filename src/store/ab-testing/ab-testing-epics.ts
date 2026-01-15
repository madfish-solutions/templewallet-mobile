import { combineEpics } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ofType } from 'ts-action-operators';

import { getABGroup$ } from 'src/apis/temple-wallet';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';

import { AnyActionEpic } from '../types';

import { getUserTestingGroupNameActions } from './ab-testing-actions';

const getUserTestingGroupNameEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(getUserTestingGroupNameActions.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([, { userId, ABTestingCategory, isAnalyticsEnabled }]) =>
      getABGroup$().pipe(
        map(testingGroupName => getUserTestingGroupNameActions.success(testingGroupName)),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('GetUserTestingGroupNameEpicError', err, [], { userId, ABTestingCategory });
          }

          return of(getUserTestingGroupNameActions.fail(err.message));
        })
      )
    )
  );

export const abTestingEpics = combineEpics(getUserTestingGroupNameEpic);
