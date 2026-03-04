import { initializeAppCheck } from '@react-native-firebase/app-check';
import { Platform } from 'react-native';
import { getReadableVersion } from 'react-native-device-info';
import { combineEpics, StateObservable } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { templeWalletApi } from 'src/api.service';
import { isIOS } from 'src/config/system';
import { VersionsInterface } from 'src/interfaces/versions.interface';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { getFirebaseApp } from 'src/utils/firebase-app.util';
import { withSelectedIsAuthorized } from 'src/utils/security.utils';

import type { RootState } from '../types';

import { checkApp } from './security-actions';

interface appCheckPayload extends VersionsInterface {
  isAppCheckFailed: boolean;
}

const CheckAppEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType(checkApp.submit),
    withUserAnalyticsCredentials(state$),
    withSelectedIsAuthorized(state$),
    switchMap(([[, { isAnalyticsEnabled, userId, ABTestingCategory }], isAuthorized]) =>
      from(getFirebaseApp().then(app => initializeAppCheck(app))).pipe(
        switchMap(appCheck => appCheck.getToken()),
        map(result => result.token),
        switchMap(appCheckToken =>
          from(
            templeWalletApi.get<appCheckPayload>('/mobile-check', {
              params: { platform: Platform.OS, appCheckToken }
            })
          )
        ),
        switchMap(({ data }) => {
          const isAppCheckFailed = data.isAppCheckFailed;

          const currentVersion = getReadableVersion();
          const minVersion = isIOS ? data.minIosVersion : data.minAndroidVersion;

          const splittedCurrentVersion = currentVersion.split('.');
          const splittedMinVersion = minVersion.split('.');

          let isForceUpdateNeeded = false;
          for (let i = 0; i < 3; i++) {
            const diff = parseInt(splittedCurrentVersion[i], 10) - parseInt(splittedMinVersion[i], 10);
            if (diff > 0) {
              break;
            } else if (diff < 0) {
              isForceUpdateNeeded = true;
              break;
            }
          }

          return of(checkApp.success({ isForceUpdateNeeded, isAppCheckFailed }));
        }),
        catchError(err => {
          isAnalyticsEnabled &&
            isAuthorized &&
            sendErrorAnalyticsEvent('AppCheckError', err, [], { userId, ABTestingCategory });

          return of(checkApp.fail(err.message));
        })
      )
    )
  );

export const securityEpics = combineEpics(CheckAppEpic);
