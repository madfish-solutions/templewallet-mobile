import { combineEpics } from 'redux-observable';
import { forkJoin, from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { betterCallDevApi, tzktApi } from '../../api.service';
import { ActivityStatusEnum } from '../../enums/activity-status.enum';
import { ActivityTypeEnum } from '../../enums/activity-type.enum';
import { GetAccountTokenTransfersResponseInterface } from '../../interfaces/get-account-token-transfers-response.interface';
import { OperationInterface } from '../../interfaces/operation.interface';
import { showErrorToast, showSuccessToast } from '../../toast/toast.utils';
import { groupActivitiesByHash } from '../../utils/activity.utils';
import { currentNetworkId$, tezos$ } from '../../utils/network/network.util';
import { mapOperationsToActivities } from '../../utils/operation.utils';
import { mapTransfersToActivities } from '../../utils/transfer.utils';
import { loadActivityGroupsActions, pushActivityAction, replaceActivityAction } from './activity-actions';

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

const operationConfirmationEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(pushActivityAction),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([activity, tezos]) =>
      from(tezos.operation.createOperation(activity[0].hash)).pipe(
        switchMap(operation =>
          from(operation.confirmation(1)).pipe(
            map(({ completed, block }) => {
              if (!completed) {
                throw new Error('Unknown reason');
              }

              showSuccessToast('Operation confirmed!');

              return replaceActivityAction(
                activity.map(activityEntry => ({
                  ...activityEntry,
                  status: ActivityStatusEnum.Applied,
                  timestamp: new Date(block.header.timestamp).getTime()
                }))
              );
            })
          )
        ),
        catchError(error =>
          of(error).pipe(
            map(() => {
              showErrorToast(`Transaction confirmation failed: ${error.message}`);

              return replaceActivityAction(
                activity.map(activityEntry => ({
                  ...activityEntry,
                  status: ActivityStatusEnum.Failed,
                  timestamp: new Date().getTime()
                }))
              );
            })
          )
        )
      )
    )
  );

export const activityEpics = combineEpics(loadActivityGroupsEpic, operationConfirmationEpic);
