import { combineEpics } from 'redux-observable';
import { from, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { bakingBadApi } from '../../api.service';
import { BakerInterface, emptyBaker } from '../../interfaces/baker.interface';
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
      from(createReadOnlyTezosToolkit(selectedAccount).rpc.getDelegate(selectedAccount.publicKeyHash)).pipe(
        switchMap(bakerAddress => {
          if (isDefined(bakerAddress)) {
            return from(bakingBadApi.get<BakerInterface>(`/bakers/${bakerAddress}`)).pipe(map(({ data }) => data));
          } else {
            return of(emptyBaker);
          }
        }),
        map(baker => loadSelectedBakerActions.success(baker)),
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
