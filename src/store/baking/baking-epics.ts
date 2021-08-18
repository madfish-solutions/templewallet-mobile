import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { bakingBadApi } from '../../api.service';
import { BakerInterface } from '../../interfaces/baker.interface';
import { isDefined } from '../../utils/is-defined';
import { createReadOnlyTezosToolkit } from '../../utils/network/tezos-toolkit.utils';
import { withSelectedAccount } from '../../utils/wallet.utils';
import { RootState } from '../create-store';
import { loadBakersListActions, loadSelectedBakerActions } from './baking-actions';

const loadSelectedBakerAddressEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadSelectedBakerActions.submit),
    withSelectedAccount(state$),
    switchMap(([, selectedAccount]) =>
      from(createReadOnlyTezosToolkit(selectedAccount).rpc.getDelegate(selectedAccount.publicKey)).pipe(
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
