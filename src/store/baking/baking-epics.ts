import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { bakingBadApi } from '../../api.service';
import { BakerInterface } from '../../interfaces/baker.interface';
import { isDefined } from '../../utils/is-defined';
import { tezos$ } from '../../utils/network/network.util';
import { loadBakersListActions, loadSelectedBakerActions } from './baking-actions';

const loadSelectedBakerAddressEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSelectedBakerActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([address, tezos]) =>
      from(tezos.rpc.getDelegate(address)).pipe(
        filter(isDefined),
        switchMap(address => bakingBadApi.get<BakerInterface>(`/bakers/${address}`)),
        map(({ data }) => loadSelectedBakerActions.success(data)),
        catchError(err => of(loadSelectedBakerActions.fail(err.message)))
      )
    )
  );

const loadBakersListEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadBakersListActions.submit),
    switchMap(() =>
      from(bakingBadApi.get<BakerInterface[]>('/bakers')).pipe(
        map(({ data }) => loadBakersListActions.success(data)),
        catchError(err => of(loadBakersListActions.fail(err.message)))
      )
    )
  );

export const bakingEpics = combineEpics(loadSelectedBakerAddressEpic, loadBakersListEpic);
