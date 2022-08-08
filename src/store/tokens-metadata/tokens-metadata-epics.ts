import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { loadTokenMetadata$, loadTokensMetadata$, loadWhitelist$ } from '../../utils/token-metadata.utils';
import {
  addTokensMetadataAction,
  loadTokenMetadataActions,
  loadTokensMetadataAction,
  loadTokenSuggestionActions,
  loadWhitelistAction
} from './tokens-metadata-actions';

const loadWhitelistEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadWhitelistAction.submit),
    switchMap(() =>
      loadWhitelist$().pipe(
        concatMap(tokenMetadata => [
          loadWhitelistAction.success(tokenMetadata),
          addTokensMetadataAction([tokenMetadata])
        ]),
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
        catchError(err => of(loadTokenSuggestionActions.fail(err.message)))
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

const loadTokensMetadataEpic = (action$: Observable<Action>) =>
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
