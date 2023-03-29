import { combineEpics, Epic } from 'redux-observable';
import { catchError, map, merge, mergeMap, Observable, of, switchMap } from 'rxjs';
import { Action } from 'ts-action';
import { ofType } from 'ts-action-operators';

import { VisibilityEnum } from 'src/enums/visibility.enum';
import { TEZ_TOKEN_METADATA } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { toTokenSlug } from 'src/token/utils/token.utils';
import { fetchRoute3Tokens, fetchRoute3Dexes$ } from 'src/utils/route3.util';
import { loadTokensMetadata$ } from 'src/utils/token-metadata.utils';

import { loadSwapDexesAction, loadSwapTokensAction, loadSwapTokensMetadataAction } from './swap-actions';

const loadSwapTokensEpic: Epic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType(loadSwapTokensAction.submit),
    switchMap(() =>
      fetchRoute3Tokens().pipe(
        mergeMap(tokens => {
          const filteredTokensList = tokens.filter(token => token.contract !== null);
          const filteredTokensSlugs = filteredTokensList.map(token =>
            toTokenSlug(token.contract ?? '', token.tokenId ?? 0)
          );

          return merge(
            of(loadSwapTokensAction.success(tokens)),
            loadTokensMetadata$(filteredTokensSlugs).pipe(
              map(tokens => {
                const tokensMapped: Array<TokenInterface> = tokens.map(tokenMetadata => ({
                  ...tokenMetadata,
                  balance: '0',
                  visibility: VisibilityEnum.Visible
                }));

                tokensMapped.unshift({ ...TEZ_TOKEN_METADATA, balance: '0', visibility: VisibilityEnum.Visible });

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

export const swapEpics = combineEpics(loadSwapTokensEpic, loadSwapDexesEpic);
