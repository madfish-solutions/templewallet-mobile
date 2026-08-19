import { BeaconErrorType, BeaconMessageType, getSenderId } from '@airgap/beacon-sdk';
import { Epic, combineEpics } from 'redux-observable';
import { EMPTY, forkJoin, from, Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { templeWalletApi } from 'src/api.service';
import { BeaconHandler } from 'src/beacon/beacon-handler';
import { DAppConnectionProtocol } from 'src/enums/dapp-connection-protocol.enum';
import { CustomDAppsInfo } from 'src/interfaces/custom-dapps-info.interface';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { WcHandler } from 'src/walletconnect/wc-handler';
import { cleanupDuplicateWcSessions } from 'src/walletconnect/wc-session-dedupe.utils';

import { emptyAction } from '../root-state.actions';
import type { AnyActionEpic } from '../types';

import { mapBeaconPermissionToConnection, mapWcSessionToConnection } from './connection.utils';
import {
  loadTokensApyActions,
  abortRequestAction,
  loadDAppsListActions,
  loadConnectionsActions,
  removeConnectionAction
} from './d-apps-actions';
import { fetchUBTCApr$, fetchUUSDCApr$ } from './utils';

const loadConnectionsEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadConnectionsActions.submit),
    withLatestFrom(state$),
    switchMap(([, state]) => {
      const previousConnections = state.dApps.connections.data;
      const previousBeaconConnections = previousConnections.filter(
        connection => connection.protocol === DAppConnectionProtocol.Beacon
      );
      const previousWcConnections = previousConnections.filter(
        connection => connection.protocol === DAppConnectionProtocol.WalletConnect
      );

      return forkJoin({
        beacon: from(BeaconHandler.getPermissions()).pipe(
          map(permissions => ({ success: true as const, permissions })),
          catchError((err: Error) => of({ success: false as const, error: err.message }))
        ),
        wc: from(cleanupDuplicateWcSessions()).pipe(
          map(sessions => ({ success: true as const, sessions })),
          catchError((err: Error) => of({ success: false as const, error: err.message }))
        )
      }).pipe(
        concatMap(({ beacon, wc }) => {
          const errors: string[] = [];
          const beaconConnections = beacon.success
            ? beacon.permissions.map(mapBeaconPermissionToConnection)
            : previousBeaconConnections;
          const wcConnections = wc.success
            ? wc.sessions.map(session => mapWcSessionToConnection(session, state.settings.evmChainsSpecs))
            : previousWcConnections;

          if (!beacon.success) {
            errors.push(beacon.error);
          }
          if (!wc.success) {
            errors.push(wc.error);
          }

          const actions = [];

          if (beacon.success || wc.success) {
            actions.push(loadConnectionsActions.success([...beaconConnections, ...wcConnections]));
          }

          if (errors.length > 0) {
            actions.push(loadConnectionsActions.fail(errors.join('; ')));
          }

          return actions;
        })
      );
    })
  );

const removeConnectionEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(removeConnectionAction),
    toPayload(),
    switchMap(connection => {
      const remove$ =
        connection.protocol === DAppConnectionProtocol.Beacon
          ? from(BeaconHandler.getPeers()).pipe(
              switchMap(peers =>
                forkJoin(
                  peers.map(peer =>
                    from(getSenderId(peer.publicKey)).pipe(
                      map(peerSenderId =>
                        connection.senderId === peerSenderId
                          ? BeaconHandler.removePeer({
                              ...peer,
                              type: 'p2p-pairing-response',
                              senderId: peerSenderId
                            })
                          : EMPTY
                      )
                    )
                  )
                )
              ),
              switchMap(() => BeaconHandler.removePermission(connection.accountIdentifier, connection.senderId))
            )
          : from(WcHandler.disconnectSession(connection.topic));

      return remove$.pipe(
        map(() => {
          showSuccessToast({ description: 'Connection successfully removed!' });

          return loadConnectionsActions.submit();
        }),
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        })
      );
    })
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

const loadDAppsListEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadDAppsListActions.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([, { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      from(templeWalletApi.get<CustomDAppsInfo>('/dapps')).pipe(
        map(({ data }) => loadDAppsListActions.success(data.dApps)),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('LoadDAppsListEpicError', err, [], { userId, ABTestingCategory });
          }

          return of(loadDAppsListActions.fail(err.message));
        })
      )
    )
  );

const loadTokensApyEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadTokensApyActions.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([, { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      forkJoin([fetchUBTCApr$(), fetchUUSDCApr$()]).pipe(
        map(responses => loadTokensApyActions.success(Object.assign({}, ...responses))),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('LoadTokensApyEpicError', err, [], { userId, ABTestingCategory });
          }

          return EMPTY;
        })
      )
    )
  );

export const dAppsEpics = combineEpics(
  loadConnectionsEpic,
  removeConnectionEpic,
  abortRequestEpic,
  loadDAppsListEpic,
  loadTokensApyEpic
);
