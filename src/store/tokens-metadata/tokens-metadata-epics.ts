import { combineEpics } from 'redux-observable';
import { catchError, concatMap, distinctUntilChanged, endWith, map, of, switchMap } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { loadScamlist$, loadTokenMetadata$, loadTokensMetadata$, loadWhitelist$ } from 'src/utils/token-metadata.utils';
import { withSelectedRpcUrl } from 'src/utils/wallet.utils';

import type { AnyActionEpic } from '../types';

import {
  putTokenMetadataAction,
  loadTokenMetadataActions,
  loadTokensMetadataActions,
  loadTokenSuggestionActions,
  loadWhitelistAction,
  loadScamlistAction
} from './tokens-metadata-actions';

const loadWhitelistEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadWhitelistAction.submit),
    withSelectedRpcUrl(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[, selectedRpcUrl], { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      loadWhitelist$(selectedRpcUrl).pipe(
        concatMap(updatedTokensMetadata => [loadWhitelistAction.success(updatedTokensMetadata)]),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadWhitelistEpicError',
              err,
              [],
              { userId, ABTestingCategory },
              { selectedRpcUrl }
            );
          }

          return of(loadWhitelistAction.fail(err.message));
        })
      )
    )
  );

const loadScamlistEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadScamlistAction.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([, { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      loadScamlist$().pipe(
        concatMap(scamSlugs => [loadScamlistAction.success(scamSlugs)]),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('LoadScamlistEpicError', err, [], { userId, ABTestingCategory });
          }

          return of(loadScamlistAction.fail(err.message));
        })
      )
    )
  );

const loadTokenSuggestionEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadTokenSuggestionActions.submit),
    toPayload(),
    withUserAnalyticsCredentials(state$),
    switchMap(([{ id, address }, { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      loadTokenMetadata$(address, id).pipe(
        concatMap(tokenMetadata => [
          loadTokenSuggestionActions.success(tokenMetadata),
          putTokenMetadataAction(tokenMetadata)
        ]),
        catchError(error => {
          console.error(error);

          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadTokenSuggestionEpicError',
              error,
              [],
              { userId, ABTestingCategory },
              { id, address }
            );
          }

          return of(loadTokenSuggestionActions.fail(error.message));
        })
      )
    )
  );

const loadTokenMetadataEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadTokenMetadataActions.submit),
    toPayload(),
    withUserAnalyticsCredentials(state$),
    concatMap(([{ id, address }, { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      loadTokenMetadata$(address, id).pipe(
        concatMap(tokenMetadata => [
          loadTokenMetadataActions.success(tokenMetadata),
          putTokenMetadataAction(tokenMetadata)
        ]),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadTokenMetadataEpicError',
              err,
              [],
              { userId, ABTestingCategory },
              { id, address }
            );
          }

          return of(loadTokenMetadataActions.fail(err.message));
        })
      )
    )
  );

/**
 * `concatMap` keeps same-account slug deltas instead of cancelling in-flight work.
 * `switchMap` on the selected account drops that queue when the user switches.
 */
const loadTokensMetadataEpic: AnyActionEpic = (action$, state$) =>
  state$.pipe(
    map(state => state.wallet.selectedAccountPublicKeyHash),
    distinctUntilChanged(),
    switchMap(() =>
      action$.pipe(
        ofType(loadTokensMetadataActions.submit),
        toPayload(),
        withUserAnalyticsCredentials(state$),
        concatMap(([slugs, { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
          loadTokensMetadata$(slugs).pipe(
            map(tokens => loadTokensMetadataActions.success({ tokens })),
            endWith(loadTokensMetadataActions.success({ tokens: [], done: true })),
            catchError(err => {
              if (isAnalyticsEnabled) {
                sendErrorAnalyticsEvent(
                  'LoadTokensMetadataEpicError',
                  err,
                  [],
                  { userId, ABTestingCategory },
                  { slugs }
                );
              }

              return of(loadTokensMetadataActions.fail(err.message));
            })
          )
        )
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
