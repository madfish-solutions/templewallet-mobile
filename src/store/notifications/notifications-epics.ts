import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { loadNotifications$ } from 'src/utils/notifications.util';

import type { RootState } from '../types';

import { loadNotificationsAction } from './notifications-actions';

const loadNotificationsEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadNotificationsAction.submit),
    withLatestFrom(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[, rootState], { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      loadNotifications$(rootState.notifications.startFromTime).pipe(
        map(newNotifications => loadNotificationsAction.success(newNotifications)),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadNotificationsEpicError',
              err,
              [],
              { userId, ABTestingCategory },
              { startFromTime: rootState.notifications.startFromTime }
            );
          }

          return of(loadNotificationsAction.fail(err.message));
        })
      )
    )
  );

export const notificationsEpics = combineEpics(loadNotificationsEpic);
