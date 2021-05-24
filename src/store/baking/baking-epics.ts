import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { bakingBadApi } from '../../api.service';
import { BakerInterface } from '../../interfaces/baker.interface';
import { tezos$ } from '../../utils/network/network.util';
import { loadBakersListActions, loadSelectedBakerAddressActions } from './baking-actions';

const loadSelectedBakerAddressEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSelectedBakerAddressActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([address, tezos]) =>
      from(tezos.rpc.getDelegate(address)).pipe(
        map(loadSelectedBakerAddressActions.success),
        catchError(err => of(loadSelectedBakerAddressActions.fail(err.message)))
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
