import { firebase } from '@react-native-firebase/app-check';
import { Platform } from 'react-native';
import { getReadableVersion } from 'react-native-device-info';
import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { templeWalletApi } from '../../api.service';
import { isIOS } from '../../config/system';
import { VersionsInterface } from '../../interfaces/versions.interface';
import { checkApp } from './security-actions';

interface appCheckPayload extends VersionsInterface {
  isAppCheckFailed: boolean;
}

const appCheck = firebase.appCheck();

export const CheckAppEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(checkApp.submit),
    switchMap(() =>
      from(appCheck.activate('ignored', false)).pipe(
        switchMap(() => appCheck.getToken()),
        map(appCheck => appCheck.token),
        catchError(() => of('INVALID_TOKEN'))
      )
    ),
    switchMap(appCheckToken =>
      from(
        templeWalletApi.get<appCheckPayload>('mobile-check', {
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
