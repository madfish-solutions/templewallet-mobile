import { getReadableVersion } from 'react-native-device-info';
import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { templeWalletApi } from '../../api.service';
import { isIOS } from '../../config/system';
import { VersionsInterface } from '../../interfaces/versions.interface';
import { checkApp } from './security-actions';

interface appCheckPayload extends VersionsInterface {
  isAppCheckFailed: boolean;
}

export const CheckAppEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(checkApp.submit),
    toPayload(),
    switchMap(appCheckToken =>
      from(
        templeWalletApi.get<appCheckPayload>('mobile-check', {
          params: { appCheckToken }
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
