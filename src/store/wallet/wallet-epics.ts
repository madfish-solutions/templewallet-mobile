import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { uniq } from 'lodash-es';
import { combineEpics } from 'redux-observable';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, concatMap, delay, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { ConfirmationTypeEnum } from '../../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../../navigator/enums/modals.enum';
import { showErrorToast } from '../../toast/toast.utils';
import { getTokenSlug } from '../../token/utils/token.utils';
import { createReadOnlyTezosToolkit } from '../../utils/rpc/tezos-toolkit.utils';
import { loadAssetBalance$, loadTezosBalance$, loadTokensWithBalance$ } from '../../utils/token-balance.utils';
import { loadTokensMetadata$ } from '../../utils/token-metadata.utils';
import { getTransferParams$ } from '../../utils/transfer-params.utils';
import { withSelectedAccount, withSelectedAccountState, withSelectedRpcUrl } from '../../utils/wallet.utils';
import { loadSelectedBakerActions } from '../baking/baking-actions';
import { RootState } from '../create-store';
import { navigateAction } from '../root-state.actions';
import { addTokensMetadataAction } from '../tokens-metadata/tokens-metadata-actions';
import {
  addTokenAction,
  loadRenderTokenBalanceActions,
  loadTezosBalanceActions,
  loadTokenBalancesActions,
  sendAssetActions,
  waitForOperationCompletionAction
} from './wallet-actions';

const updateDataActions = () => [
  loadTezosBalanceActions.submit(),
  loadTokenBalancesActions.submit(),
  loadSelectedBakerActions.submit()
];

const loadRenderTokenBalanceEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadRenderTokenBalanceActions.submit),
    toPayload(),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    concatMap(([[assetSlug, selectedAccount], rpcUrl]) => {
      return loadAssetBalance$(rpcUrl, selectedAccount.publicKeyHash, assetSlug).pipe(
        map(tokenBalance => {
          return loadRenderTokenBalanceActions.success({ slug: assetSlug, balance: tokenBalance ?? '0' });
        })
      );
    })
  );

const loadTokenBalancesEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTokenBalancesActions.submit),
    withSelectedAccount(state$),
    withSelectedAccountState(state$),
    switchMap(([[, selectedAccount], selectedAccountState]) =>
      loadTokensWithBalance$(selectedAccount.publicKeyHash).pipe(
        switchMap(tokensWithBalance => {
          const assetSlugs = uniq([
            ...selectedAccountState.tokensList.map(token => token.slug),
            ...tokensWithBalance.map(tokenWithBalance =>
              getTokenSlug({
                address: tokenWithBalance.token.contract.address,
                id: tokenWithBalance.token.tokenId
              })
            )
          ]);

          return loadTokensMetadata$(assetSlugs);
        }),
        concatMap(metadataList => [
          addTokensMetadataAction(metadataList),
          loadTokenBalancesActions.success(
            metadataList.reduce((prev, cur) => ({ ...prev, [`${cur.address}_${cur.id}`]: '0' }), {})
          )
        ]),
        catchError(err => of(loadTokenBalancesActions.fail(err.message)))
      )
    )
  );

const loadTezosBalanceEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTezosBalanceActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[, selectedAccount], rpcUrl]) =>
      loadTezosBalance$(rpcUrl, selectedAccount.publicKeyHash).pipe(
        map(balance => loadTezosBalanceActions.success(balance)),
        catchError(err => of(loadTezosBalanceActions.fail(err.message)))
      )
    )
  );

const sendAssetEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(sendAssetActions.submit),
    toPayload(),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[{ asset, receiverPublicKeyHash, amount }, selectedAccount], rpcUrl]) =>
      getTransferParams$(asset, rpcUrl, selectedAccount, receiverPublicKeyHash, new BigNumber(amount)).pipe(
        map((transferParams): ParamsWithKind[] => [{ ...transferParams, kind: OpKind.TRANSACTION }]),
        map(opParams =>
          navigateAction(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.InternalOperations, opParams })
        )
      )
    )
  );

const BCD_INDEXING_DELAY = 15000;

const waitForOperationCompletionEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(waitForOperationCompletionAction),
    toPayload(),
    withSelectedRpcUrl(state$),
    switchMap(([{ opHash, sender }, rpcUrl]) =>
      from(createReadOnlyTezosToolkit(rpcUrl, sender).operation.createOperation(opHash)).pipe(
        switchMap(operation => operation.confirmation(1)),
        catchError(err => {
          if (err.message === 'Confirmation polling timed out') {
            return of(undefined);
          } else {
            throw new Error(err.message);
          }
        }),
        delay(BCD_INDEXING_DELAY),
        concatMap(updateDataActions),
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        })
      )
    )
  );
const addTokenMetadataEpic = (action$: Observable<Action>) =>
  action$.pipe(ofType(addTokenAction), concatMap(updateDataActions));

export const walletEpics = combineEpics(
  loadRenderTokenBalanceEpic,
  loadTezosBalanceEpic,
  loadTokenBalancesEpic,
  sendAssetEpic,
  waitForOperationCompletionEpic,
  addTokenMetadataEpic
);
