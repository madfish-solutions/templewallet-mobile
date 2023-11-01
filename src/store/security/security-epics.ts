import { firebase } from '@react-native-firebase/app-check';
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
import { sendAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withSelectedIsAnalyticsEnabled, withSelectedIsAuthorized, withSelectedUserId } from 'src/utils/security.utils';

import type { RootState } from '../types';

import { checkApp } from './security-actions';

interface appCheckPayload extends VersionsInterface {
  isAppCheckFailed: boolean;
}

const appCheck = firebase.appCheck();

const CheckAppEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType(checkApp.submit),
    withSelectedUserId(state$),
    withSelectedIsAnalyticsEnabled(state$),
    withSelectedIsAuthorized(state$),
    switchMap(([[[, userId], isAnalyticsEnabled], isAuthorized]) =>
      from(appCheck.activate('ignored', false)).pipe(
        switchMap(() => appCheck.getToken()),
        map(appCheck => appCheck.token),
        catchError(err => {
          isAnalyticsEnabled &&
            isAuthorized &&
            sendAnalyticsEvent('AppCheckError', undefined, { userId }, { message: err.message });

          return of(JSON.stringify(err));
        })
      )
    ),
    switchMap(appCheckToken =>
      from(
        templeWalletApi.get<appCheckPayload>('/mobile-check', {
          params: { platform: Platform.OS, appCheckToken }
        })
      ).pipe(
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

          return [checkApp.success({ isForceUpdateNeeded, isAppCheckFailed })];
        }),
        catchError(err => of(checkApp.fail(err.message)))
      )
    )
  );

export const securityEpics = combineEpics(CheckAppEpic);
