import { combineEpics, Epic } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import {
  checkTokensMetadata$,
  loadTokenMetadata$,
  loadTokensMetadata$,
  loadWhitelist$
} from '../../utils/token-metadata.utils';
import { withSelectedAccount, withSelectedRpcUrl } from '../../utils/wallet.utils';
import { RootState } from '../create-store';
import {
  addTokensMetadataAction,
  loadTokenMetadataActions,
  loadTokensMetadataAction,
  loadTokenSuggestionActions,
  loadWhitelistAction
} from './tokens-metadata-actions';

const loadWhitelistEpic: Epic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadWhitelistAction.submit),
    withSelectedRpcUrl(state$),
    withSelectedAccount(state$),
    switchMap(([[, selectedRpcUrl], account]) =>
      loadWhitelist$(selectedRpcUrl).pipe(
        switchMap(tokensMetadata => checkTokensMetadata$(tokensMetadata, account)),
        concatMap(updatedTokensMetadata => [loadWhitelistAction.success(updatedTokensMetadata)]),
        catchError(err => of(loadWhitelistAction.fail(err.message)))
      )
    )
  );

const loadTokenSuggestionEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenSuggestionActions.submit),
    toPayload(),
    switchMap(({ id, address }) =>
      loadTokenMetadata$(address, id).pipe(
        concatMap(tokenMetadata => [
          loadTokenSuggestionActions.success(tokenMetadata),
          addTokensMetadataAction([tokenMetadata])
        ]),
        catchError(error => {
          console.error(error);

          return of(loadTokenSuggestionActions.fail(error.message));
        })
      )
    )
  );

const loadTokenMetadataEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadTokenMetadataActions.submit),
    toPayload(),
    concatMap(({ id, address }) =>
      loadTokenMetadata$(address, id).pipe(
        concatMap(tokenMetadata => [
          loadTokenMetadataActions.success(tokenMetadata),
          addTokensMetadataAction([tokenMetadata])
        ]),
        catchError(err => of(loadTokenMetadataActions.fail(err.message)))
      )
    )
  );

const loadTokensMetadataEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTokensMetadataAction),
    toPayload(),
    withSelectedAccount(state$),
    switchMap(([slugs, account]) =>
      loadTokensMetadata$(slugs).pipe(
        switchMap(tokensMetadata => checkTokensMetadata$(tokensMetadata, account)),
        map(tokensMetadata => addTokensMetadataAction(tokensMetadata)),
        catchError(err => of(loadTokenMetadataActions.fail(err.message)))
      )
    )
  );

export const tokensMetadataEpics = combineEpics(
  loadWhitelistEpic,
  loadTokenSuggestionEpic,
  loadTokenMetadataEpic,
  loadTokensMetadataEpic
);
