import { BeaconErrorType, BeaconMessageType, getSenderId } from '@airgap/beacon-sdk';
import { combineEpics } from 'redux-observable';
import { EMPTY, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { templeWalletApi } from '../../api.service';
import { getTzBtcApy$ } from '../../apollo/kord-fi/get-tz-btc-apy';
import { getKUSDApy$ } from '../../apollo/yupana/get-kusd-apy';
import { BeaconHandler } from '../../beacon/beacon-handler';
import { CustomDAppsInfo } from '../../interfaces/custom-dapps-info.interface';
import { StacksEnum } from '../../navigator/enums/stacks.enum';
import { showErrorToast, showSuccessToast } from '../../toast/toast.utils';
import { navigateAction } from '../root-state.actions';
import {
  loadTokensApyActions,
  abortRequestAction,
  loadDAppsListActions,
  loadPermissionsActions,
  removePermissionAction
} from './d-apps-actions';

const loadPermissionsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadPermissionsActions.submit),
    switchMap(() =>
      from(BeaconHandler.getPermissions()).pipe(
        map(loadPermissionsActions.success),
        catchError(err => of(loadPermissionsActions.fail(err.message)))
      )
    )
  );

const removePermissionEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(removePermissionAction),
    toPayload(),
    switchMap(({ accountIdentifier, senderId }) =>
      from(BeaconHandler.getPeers()).pipe(
        switchMap(peers =>
          forkJoin(
            peers.map(peer =>
              from(getSenderId(peer.publicKey)).pipe(
                map(peerSenderId =>
                  senderId === peerSenderId
                    ? BeaconHandler.removePeer({ ...peer, type: 'p2p-pairing-response', senderId: peerSenderId })
                    : EMPTY
                )
              )
            )
          ).pipe(
            switchMap(() => BeaconHandler.removePermission(accountIdentifier)),
            map(() => {
              showSuccessToast({ description: 'Permission successfully removed!' });

              return loadPermissionsActions.submit();
            }),
            catchError(err => {
              showErrorToast({ description: err.message });

              return EMPTY;
            })
          )
        )
      )
    )
  );

const abortRequestEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(abortRequestAction),
    toPayload(),
    switchMap(id =>
      from(
        BeaconHandler.respond({
          id,
          type: BeaconMessageType.Error,
          errorType: BeaconErrorType.ABORTED_ERROR
        })
      ).pipe(
        map(() => {
          showSuccessToast({ description: 'Request aborted!' });

          return navigateAction(StacksEnum.MainStack);
        }),
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        })
      )
    )
  );

const loadDAppsListEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadDAppsListActions.submit),
    switchMap(() =>
      from(templeWalletApi.get<CustomDAppsInfo>('/dapps')).pipe(
        map(({ data }) => loadDAppsListActions.success(data.dApps)),
        catchError(err => of(loadDAppsListActions.fail(err.message)))
      )
    )
  );

const loadTokensApyEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokensApyActions.submit),
    switchMap(() =>
      forkJoin([getTzBtcApy$(), getKUSDApy$()]).pipe(
        map(responses => loadTokensApyActions.success(Object.assign({}, ...responses)))
      )
    )
  );

export const dAppsEpics = combineEpics(
  loadPermissionsEpic,
  removePermissionEpic,
  abortRequestEpic,
  loadDAppsListEpic,
  loadTokensApyEpic
);
