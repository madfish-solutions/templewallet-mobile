import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { loadTezosBalance$ } from '../../utils/token-balance.utils';
import { withSelectedRpcUrl } from '../../utils/wallet.utils';
import { RootState } from '../create-store';
import { loadContactTezosBalance } from './contact-book-actions';

const loadContactTezosBalanceEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadContactTezosBalance.submit),
    toPayload(),
    withSelectedRpcUrl(state$),
    switchMap(([publicKeyHash, rpcUrl]) =>
      loadTezosBalance$(rpcUrl, publicKeyHash).pipe(
        map(tezosBalance => loadContactTezosBalance.success({ publicKeyHash, tezosBalance })),
        catchError(err => of(loadContactTezosBalance.fail(err.message)))
      )
    )
  );

export const contactsEpics = combineEpics(loadContactTezosBalanceEpic);
