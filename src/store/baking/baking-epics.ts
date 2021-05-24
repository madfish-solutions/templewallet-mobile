import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { tezos$ } from '../../utils/network/network.util';
import { loadSelectedBakerAddressActions } from './baking-actions';

const loadSelectedBakerAddressEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSelectedBakerAddressActions.submit),
    toPayload(),
    withLatestFrom(tezos$),
    switchMap(([address, tezos]) =>
      from(tezos.rpc.getDelegate(address)).pipe(
        map(bakerAddress => loadSelectedBakerAddressActions.success(bakerAddress)),
        catchError(err => of(loadSelectedBakerAddressActions.fail(err.message)))
      )
    )
  );

export const bakingEpics = combineEpics(loadSelectedBakerAddressEpic);
