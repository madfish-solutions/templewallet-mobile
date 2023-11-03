import { BeaconErrorType, BeaconMessageType, getSenderId } from '@airgap/beacon-sdk';
import { Epic, combineEpics } from 'redux-observable';
import { EMPTY, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { templeWalletApi } from 'src/api.service';
import { BeaconHandler } from 'src/beacon/beacon-handler';
import { CustomDAppsInfo } from 'src/interfaces/custom-dapps-info.interface';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { withUsdToTokenRates } from 'src/utils/wallet.utils';

import { emptyAction } from '../root-state.actions';
import type { RootState } from '../types';

import {
  loadTokensApyActions,
  abortRequestAction,
  loadDAppsListActions,
  loadPermissionsActions,
  removePermissionAction
} from './d-apps-actions';
import { fetchUSDTApy$, fetchKUSDApy$, fetchTzBtcApy$, fetchUBTCApr$, fetchUUSDCApr$, fetchYOUApr$ } from './utils';

const loadPermissionsEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadPermissionsActions.submit),
    switchMap(() =>
      from(BeaconHandler.getPermissions()).pipe(
        map(loadPermissionsActions.success),
        catchError(err => of(loadPermissionsActions.fail(err.message)))
      )
    )
  );

const removePermissionEpic: Epic = (action$: Observable<Action>) =>
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

const abortRequestEpic: Epic = (action$: Observable<Action>) =>
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

          return emptyAction;
        }),
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        })
      )
    )
  );

const loadDAppsListEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadDAppsListActions.submit),
    switchMap(() =>
      from(templeWalletApi.get<CustomDAppsInfo>('/dapps')).pipe(
        map(({ data }) => loadDAppsListActions.success(data.dApps)),
        catchError(err => of(loadDAppsListActions.fail(err.message)))
      )
    )
  );

const loadTokensApyEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTokensApyActions.submit),
    withUsdToTokenRates(state$),
    switchMap(([, tokenUsdExchangeRates]) =>
      forkJoin([
        fetchUSDTApy$(),
        fetchTzBtcApy$(),
        fetchKUSDApy$(),
        fetchUBTCApr$(),
        fetchUUSDCApr$(),
        fetchYOUApr$(tokenUsdExchangeRates)
      ]).pipe(map(responses => loadTokensApyActions.success(Object.assign({}, ...responses))))
    )
  );

export const dAppsEpics = combineEpics(
  loadPermissionsEpic,
  removePermissionEpic,
  abortRequestEpic,
  loadDAppsListEpic,
  loadTokensApyEpic
);
