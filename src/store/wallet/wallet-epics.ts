import { Observable, of } from 'rxjs';
import { Action } from 'ts-action';
import { createWalletActions } from './wallet-actions';
import { ofType, toPayload } from 'ts-action-operators';
import { mapTo, switchMap } from 'rxjs/operators';

export const createWalletEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(createWalletActions.create),
    toPayload(),
    switchMap(password => {
      console.log(password);

      return of(1);
    }),
    mapTo(createWalletActions.success({}))
  );
