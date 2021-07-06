import { combineEpics } from 'redux-observable';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { betterCallDevApi, tzktApi } from '../../api.service';
import { ActivityTypeEnum } from '../../enums/activity-type.enum';
import { GetAccountTokenTransfersResponseInterface } from '../../interfaces/get-account-token-transfers-response.interface';
import { OperationInterface } from '../../interfaces/operation.interface';
import { emptyWalletAccount } from '../../interfaces/wallet-account.interface';
import { showErrorToast } from '../../toast/toast.utils';
import { accountPkh$, groupActivitiesByHash } from '../../utils/activity.utils';
import { currentNetworkId$, tezos$ } from '../../utils/network/network.util';
import { mapOperationsToActivities } from '../../utils/operation.utils';
import { mapTransfersToActivities } from '../../utils/transfer.utils';
import { addPendingOperation, loadActivityGroupsActions, removePendingOperation } from './activity-actions';

export const loadActivityGroupsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadActivityGroupsActions.submit),
    toPayload(),
    withLatestFrom(currentNetworkId$),
    switchMap(([address, currentNetworkId]) =>
      forkJoin(
        from(
          tzktApi.get<OperationInterface[]>(
            `accounts/${address}/operations?limit=100&type=${ActivityTypeEnum.Delegation},${ActivityTypeEnum.Origination},${ActivityTypeEnum.Transaction}`
          )
        ).pipe(map(({ data }) => mapOperationsToActivities(address, data))),
        from(
          betterCallDevApi.get<GetAccountTokenTransfersResponseInterface>(
            `/tokens/${currentNetworkId}/transfers/${address}`,
            { params: { max: 100, start: 0 } }
          )
        ).pipe(map(({ data }) => mapTransfersToActivities(address, data.transfers)))
      ).pipe(
        map(([operations, transfers]) => groupActivitiesByHash(operations, transfers)),
        map(activityGroups => loadActivityGroupsActions.success(activityGroups)),
        catchError(err => of(loadActivityGroupsActions.fail(err.message)))
      )
    )
  );

export const addPendingOperationEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(addPendingOperation),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([activities, tezos]) =>
      from(tezos.operation.createOperation(activities[0].hash).then(operation => operation.confirmation(1))).pipe(
        switchMap(({ completed }) => {
          if (!completed) {
            showErrorToast('Error', 'Operation was backtracked');
          }

          return of(removePendingOperation(activities));
        })
      )
    )
  );

export const removePendingOperationEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(removePendingOperation),
    toPayload(),
    withLatestFrom(accountPkh$),
    switchMap(([, address]) => of(loadActivityGroupsActions.submit(address ?? emptyWalletAccount.publicKeyHash)))
  );

export const activityEpics = combineEpics(loadActivityGroupsEpic, addPendingOperationEpic, removePendingOperationEpic);
