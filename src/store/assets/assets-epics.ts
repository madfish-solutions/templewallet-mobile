import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { loadAssetsActions } from './assets-actions';
import { requestGetAssets } from '../../api.service';

export const loadAssetsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadAssetsActions.submit),
    toPayload(),
    switchMap(payload => requestGetAssets(payload)),
    map(data => loadAssetsActions.success(data.balances)),
    catchError(err => of(loadAssetsActions.fail(err)))
  );
