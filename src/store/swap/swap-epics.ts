import { BigNumber } from 'bignumber.js';
import { combineEpics } from 'redux-observable';
import { from, merge, mergeMap, of, switchMap, defer, catchError, exhaustMap, finalize, map, takeUntil } from 'rxjs';
import { ofType, toPayload } from 'ts-action-operators';

import { EvmSwapApiError, get3RouteEvmTokens } from 'src/apis/temple-wallet/evm-swap';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { Route3SwapParamsRequest, Route3SwapParamsRequestRaw } from 'src/interfaces/route3.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { isDefined } from 'src/utils/is-defined';
import { fetchRoute3Tokens$, fetchRoute3Dexes$, fetchRoute3SwapParams } from 'src/utils/route3.util';
import { loadTokensMetadata$ } from 'src/utils/token-metadata.utils';

import { resetApplicationAction } from '../root-state.actions';
import { AnyActionEpic } from '../types';

import {
  loadEvmSwapTokensAction,
  loadSwapDexesAction,
  loadSwapParamsAction,
  loadSwapTokensAction,
  loadSwapTokensMetadataAction,
  resetSwapParamsAction
} from './swap-actions';

const isSwapParamsDefined = (
  requestParams: Route3SwapParamsRequest | Route3SwapParamsRequestRaw
): requestParams is Route3SwapParamsRequest =>
  isDefined(requestParams.amount) &&
  new BigNumber(requestParams.amount).isGreaterThan(0) &&
  isDefined(requestParams.fromSymbol) &&
  isDefined(requestParams.toSymbol);

const loadSwapParamsEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadSwapParamsAction.submit),
    toPayload(),
    withUserAnalyticsCredentials(state$),
    switchMap(([payload, { userId, ABTestingCategory, isAnalyticsEnabled }]) => {
      if (isSwapParamsDefined(payload)) {
        return from(fetchRoute3SwapParams(payload)).pipe(
          map(params => loadSwapParamsAction.success(params)),
          catchError(error => {
            if (isAnalyticsEnabled) {
              sendErrorAnalyticsEvent('LoadSwapParamsEpicError', error, [], { userId, ABTestingCategory }, { payload });
            }

            return of(loadSwapParamsAction.fail(error.message));
          })
        );
      }

      return of(resetSwapParamsAction());
    })
  );

const loadSwapTokensEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadSwapTokensAction.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([, { userId, ABTestingCategory, isAnalyticsEnabled }]) => {
      const fetchedData: Record<string, unknown> = {};

      return fetchRoute3Tokens$().pipe(
        mergeMap(tokens => {
          fetchedData.tokens = tokens;
          const filteredTokensList = tokens.filter(token => token.contract !== null);
          const filteredTokensSlugs = filteredTokensList.map(token =>
            toTokenSlug(token.contract ?? '', token.tokenId ?? 0)
          );

          return merge(
            of(loadSwapTokensAction.success(tokens)),
            loadTokensMetadata$(filteredTokensSlugs).pipe(
              map(tokens => {
                fetchedData.tokensMetadata = tokens;
                const tokensMapped: TokenInterface[] = tokens.map(tokenMetadata => ({
                  ...tokenMetadata,
                  balance: '0',
                  visibility: VisibilityEnum.Visible
                }));

                return loadSwapTokensMetadataAction.success(tokensMapped);
              })
            )
          );
        }),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('LoadSwapTokensEpicError', err, [], { userId, ABTestingCategory }, { fetchedData });
          }

          return of(loadSwapTokensAction.fail(err.message));
        })
      );
    })
  );

const loadSwapDexesEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadSwapDexesAction.submit),
    withUserAnalyticsCredentials(state$),
    switchMap(([, { userId, ABTestingCategory, isAnalyticsEnabled }]) =>
      fetchRoute3Dexes$().pipe(
        map(dexes => loadSwapDexesAction.success(dexes)),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('LoadSwapDexesEpicError', err, [], { userId, ABTestingCategory });
          }

          return of(loadSwapDexesAction.fail(err.message));
        })
      )
    )
  );

const loadEvmSwapTokensEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadEvmSwapTokensAction.submit),
    exhaustMap(() => {
      const retryAt = state$.value.swap.evmTokens.retryAt;
      if (retryAt !== undefined && Date.now() < retryAt) {
        return of(loadEvmSwapTokensAction.fail({ message: 'Wait before you retry the token request.', retryAt }));
      }

      const controller = new AbortController();

      return defer(() => from(get3RouteEvmTokens(controller.signal))).pipe(
        map(tokens => loadEvmSwapTokensAction.success(tokens)),
        catchError((error: unknown) =>
          of(
            loadEvmSwapTokensAction.fail({
              message: error instanceof Error ? error.message : 'Cannot load 3Route tokens.',
              retryAt:
                error instanceof EvmSwapApiError && error.code === 'rate-limit'
                  ? error.retryAt ?? Date.now() + 60_000
                  : undefined
            })
          )
        ),
        takeUntil(action$.pipe(ofType(resetApplicationAction.success))),
        finalize(() => controller.abort())
      );
    })
  );

export const swapEpics = combineEpics(loadSwapParamsEpic, loadSwapTokensEpic, loadSwapDexesEpic, loadEvmSwapTokensEpic);
