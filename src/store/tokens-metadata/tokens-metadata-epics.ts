import { Action } from 'redux';
import { combineEpics, Epic } from 'redux-observable';
import { of, map } from 'rxjs';
import { catchError, concatMap, switchMap } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { loadScamlist$, loadTokenMetadata$, loadTokensMetadata$, loadWhitelist$ } from 'src/utils/token-metadata.utils';
import { withSelectedRpcUrl } from 'src/utils/wallet.utils';

import type { RootState } from '../types';

import {
  putTokenMetadataAction,
  loadTokenMetadataActions,
  loadTokensMetadataActions,
  loadTokenSuggestionActions,
  loadWhitelistAction,
  loadScamlistAction
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

const loadScamlistEpic: Epic<Action, Action, RootState> = action$ =>
  action$.pipe(
    ofType(loadScamlistAction.submit),
    switchMap(() =>
      loadScamlist$().pipe(
        concatMap(scamSlugs => [loadScamlistAction.success(scamSlugs)]),
        catchError(err => of(loadScamlistAction.fail(err.message)))
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
          putTokenMetadataAction(tokenMetadata)
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
          putTokenMetadataAction(tokenMetadata)
        ]),
        catchError(err => of(loadTokenMetadataActions.fail(err.message)))
      )
    )
  );

const loadTokensMetadataEpic: Epic = action$ =>
  action$.pipe(
    ofType(loadTokensMetadataActions.submit),
    toPayload(),
    switchMap(slugs =>
      loadTokensMetadata$(slugs).pipe(
        map(tokensMetadata => loadTokensMetadataActions.success(tokensMetadata)),
        catchError(err => of(loadTokensMetadataActions.fail(err.message)))
      )
    )
  );

export const tokensMetadataEpics = combineEpics(
  loadWhitelistEpic,
  loadScamlistEpic,
  loadTokenSuggestionEpic,
  loadTokenMetadataEpic,
  loadTokensMetadataEpic
);
