import { firebase } from '@react-native-firebase/app-check';
import { Platform } from 'react-native';
import { getReadableVersion } from 'react-native-device-info';
import { combineEpics, StateObservable } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { templeWalletApi } from '../../api.service';
import { isIOS } from '../../config/system';
import { VersionsInterface } from '../../interfaces/versions.interface';
import { AnalyticsEventCategory } from '../../utils/analytics/analytics-event.enum';
import { segmentClient } from '../../utils/analytics/analytics.util';
import { RootState } from '../create-store';
import { checkApp } from './security-actions';

interface appCheckPayload extends VersionsInterface {
  isAppCheckFailed: boolean;
}

const appCheck = firebase.appCheck();

export const CheckAppEpic = (action$: Observable<Action>, state$: StateObservable<RootState>) =>
  action$.pipe(
    ofType(checkApp.submit),
    switchMap(() =>
      from(appCheck.activate('ignored', false)).pipe(
        switchMap(() => appCheck.getToken()),
        map(appCheck => appCheck.token),
        catchError(err => {
          const settings = state$.value.settings;

          settings.isAnalyticsEnabled &&
            segmentClient.track(AnalyticsEventCategory.General, {
              userId: settings.userId,
              event: 'AppCheckError',
              timestamp: new Date().getTime(),
              properties: {
                event: 'AppCheckError',
                category: AnalyticsEventCategory.General,
                message: err.message
              }
            });

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
            if (parseInt(splittedCurrentVersion[i], 10) < parseInt(splittedMinVersion[i], 10)) {
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
