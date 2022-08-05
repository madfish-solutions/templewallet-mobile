import { combineEpics } from 'redux-observable';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { RpcTypeEnum } from '../../enums/rpc-type.enum';
import { emptyTokenMetadata } from '../../token/interfaces/token-metadata.interface';
import { loadTokenMetadata$, loadTokensMetadata$ } from '../../utils/token-metadata.utils';
import { withSelectedRpc } from '../../utils/wallet.utils';
import { RootState } from '../create-store';
import {
  addDcpTokensMetadataAction,
  addTokensMetadataAction,
  loadTokenMetadataActions,
  loadTokensMetadataAction,
  loadTokenSuggestionActions
} from './tokens-metadata-actions';

const loadTokenSuggestionEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTokenSuggestionActions.submit),
    toPayload(),
    withSelectedRpc(state$),
    switchMap(([{ id, address }, selectedRpc]) => {
      const isDcpNode = selectedRpc.type === RpcTypeEnum.DCP;

      return isDcpNode
        ? [
            loadTokenSuggestionActions.success({ ...emptyTokenMetadata, id, address }),
            addDcpTokensMetadataAction([{ ...emptyTokenMetadata, id, address }])
          ]
        : loadTokenMetadata$(address, id).pipe(
            concatMap(tokenMetadata => [
              loadTokenSuggestionActions.success(tokenMetadata),
              addTokensMetadataAction([tokenMetadata])
            ]),
            catchError(err => of(loadTokenSuggestionActions.fail(err.message)))
          );
    })
  );

const loadTokenMetadataEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTokenMetadataActions.submit),
    toPayload(),
    withSelectedRpc(state$),
    concatMap(([{ id, address }, selectedRpc]) =>
      loadTokenMetadata$(address, id).pipe(
        concatMap(tokenMetadata => {
          const isDcpNode = selectedRpc.type === RpcTypeEnum.DCP;

          return [
            loadTokenMetadataActions.success(tokenMetadata),
            isDcpNode ? addDcpTokensMetadataAction([tokenMetadata]) : addTokensMetadataAction([tokenMetadata])
          ];
        }),
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

export const tokensMetadataEpics = combineEpics(loadTokenSuggestionEpic, loadTokenMetadataEpic, loadTokensMetadataEpic);
