import { BigNumber } from 'bignumber.js';
import { combineEpics, Epic } from 'redux-observable';
import { catchError, from, map, merge, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { Route3SwapParamsRequest, Route3SwapParamsRequestRaw } from 'src/interfaces/route3.interface';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { fetchRoute3Tokens$, fetchRoute3Dexes$, fetchRoute3SwapParams } from 'src/utils/route3.util';
import { loadTokensMetadata$ } from 'src/utils/token-metadata.utils';

import {
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

const loadSwapParamsEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSwapParamsAction.submit),
    toPayload(),
    switchMap(payload => {
      if (isSwapParamsDefined(payload)) {
        return from(fetchRoute3SwapParams(payload)).pipe(
          map(params => loadSwapParamsAction.success(params)),
          catchError(error => of(loadSwapParamsAction.fail(error.message)))
        );
      }

      return of(resetSwapParamsAction());
    })
  );

const loadSwapTokensEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSwapTokensAction.submit),
    switchMap(() =>
      fetchRoute3Tokens$().pipe(
        mergeMap(tokens => {
          const filteredTokensList = tokens.filter(token => token.contract !== null);
          const filteredTokensSlugs = filteredTokensList.map(token =>
            toTokenSlug(token.contract ?? '', token.tokenId ?? 0)
          );

          return merge(
            of(loadSwapTokensAction.success(tokens)),
            loadTokensMetadata$(filteredTokensSlugs).pipe(
              map(tokens => {
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
        catchError(err => of(loadSwapTokensAction.fail(err.message)))
      )
    )
  );

const loadSwapDexesEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSwapDexesAction.submit),
    switchMap(() =>
      fetchRoute3Dexes$().pipe(
        map(dexes => loadSwapDexesAction.success(dexes)),
        catchError(err => of(loadSwapDexesAction.fail(err.message)))
      )
    )
  );

export const swapEpics = combineEpics(loadSwapParamsEpic, loadSwapTokensEpic, loadSwapDexesEpic);
