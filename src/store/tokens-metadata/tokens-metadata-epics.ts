import { Action } from 'redux';
import { combineEpics, Epic } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { loadTokenMetadata$, loadTokensMetadata$, loadWhitelist$ } from '../../utils/token-metadata.utils';
import { withSelectedRpcUrl } from '../../utils/wallet.utils';
import type { RootState } from '../types';
import {
  addTokensMetadataAction,
  loadTokenMetadataActions,
  loadTokensMetadataAction,
  loadTokenSuggestionActions,
  loadWhitelistAction
} from './tokens-metadata-actions';

const loadWhitelistEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(loadWhitelistAction.submit),
    withSelectedRpcUrl(state$),
    switchMap(([, selectedRpcUrl]) =>
      loadWhitelist$(selectedRpcUrl).pipe(
        concatMap(updatedTokensMetadata => [loadWhitelistAction.success(updatedTokensMetadata)]),
        catchError(err => of(loadWhitelistAction.fail(err.message)))
      )
    )
  );

const loadTokenSuggestionEpic: Epic = action$ =>
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

const loadTokenMetadataEpic: Epic = action$ =>
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

const loadTokensMetadataEpic: Epic = action$ =>
  action$.pipe(
    ofType(loadTokensMetadataAction),
    toPayload(),
    switchMap(slugs =>
      loadTokensMetadata$(slugs).pipe(
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
