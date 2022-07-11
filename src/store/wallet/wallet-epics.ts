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
import { isDefined } from '../../utils/is-defined';
import { createReadOnlyTezosToolkit } from '../../utils/rpc/tezos-toolkit.utils';
import { loadAssetBalance$, loadTezosBalance$, loadTokensWithBalance$ } from '../../utils/token-balance.utils';
import { withMetadataSlugs } from '../../utils/token-metadata.utils';
import { getTransferParams$ } from '../../utils/transfer-params.utils';
import { withSelectedAccount, withSelectedAccountState, withSelectedRpcUrl } from '../../utils/wallet.utils';
import { loadSelectedBakerActions } from '../baking/baking-actions';
import { RootState } from '../create-store';
import { navigateAction } from '../root-state.actions';
import { loadTokensMetadataAction } from '../tokens-metadata/tokens-metadata-actions';
import {
  addTokenAction,
  highPriorityLoadTokenBalanceAction,
  loadTezosBalanceActions,
  loadTokenBalanceActions,
  loadTokensWithBalancesActions,
  sendAssetActions,
  waitForOperationCompletionAction
} from './wallet-actions';

const updateDataActions = () => [
  loadTezosBalanceActions.submit(),
  loadTokensWithBalancesActions.submit(),
  loadSelectedBakerActions.submit()
];

const highPriorityLoadTokenBalanceEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(highPriorityLoadTokenBalanceAction),
    toPayload(),
    withSelectedRpcUrl(state$),
    switchMap(([payload, rpcUrl]) =>
      loadAssetBalance$(rpcUrl, payload.publicKeyHash, payload.slug).pipe(
        map(balance =>
          isDefined(balance)
            ? loadTokenBalanceActions.success({
                publicKeyHash: payload.publicKeyHash,
                slug: payload.slug,
                balance
              })
            : loadTokenBalanceActions.fail(`${payload.slug} balance load FAILED`)
        )
      )
    )
  );

const loadTokenBalanceEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTokenBalanceActions.submit),
    toPayload(),
    concatMap(payload =>
      of(payload).pipe(
        withSelectedAccount(state$),
        withSelectedRpcUrl(state$),
        switchMap(([[payload, selectedAccount], rpcUrl]) => {
          if (selectedAccount.publicKeyHash === payload.publicKeyHash) {
            return loadAssetBalance$(rpcUrl, payload.publicKeyHash, payload.slug).pipe(
              delay(100),
              map(balance =>
                isDefined(balance)
                  ? loadTokenBalanceActions.success({
                      publicKeyHash: payload.publicKeyHash,
                      slug: payload.slug,
                      balance
                    })
                  : loadTokenBalanceActions.fail(`${payload.slug} balance load FAILED`)
              )
            );
          }

          return of(loadTokenBalanceActions.fail(`${payload.slug} balance load SKIPPED`)).pipe(delay(5));
        })
      )
    )
  );

const loadTokensWithBalancesEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTokensWithBalancesActions.submit),
    withSelectedAccount(state$),
    withSelectedAccountState(state$),
    withMetadataSlugs(state$),
    switchMap(([[[, selectedAccount], selectedAccountState], metadataRecord]) =>
      loadTokensWithBalance$(selectedAccount.publicKeyHash).pipe(
        concatMap(tokensWithBalance => {
          const tokensWithBalancesSlugs = tokensWithBalance.map(tokenWithBalance =>
            getTokenSlug({
              address: tokenWithBalance.token.contract.address,
              id: tokenWithBalance.token.tokenId
            })
          );

          const accountTokensSlugs = (selectedAccountState.tokensList ?? []).map(token => token.slug);
          const existingMetadataSlugs = Object.keys(metadataRecord);

          const allTokensSlugs = uniq([...accountTokensSlugs, ...tokensWithBalancesSlugs]);
          const assetWithoutMetadataSlugs = allTokensSlugs.filter(x => !existingMetadataSlugs.includes(x));

          return [
            loadTokensWithBalancesActions.success(tokensWithBalancesSlugs),
            loadTokensMetadataAction(assetWithoutMetadataSlugs),
            ...allTokensSlugs.map(slug =>
              loadTokenBalanceActions.submit({
                publicKeyHash: selectedAccount.publicKeyHash,
                slug
              })
            )
          ];
        }),
        catchError(err => of(loadTokensWithBalancesActions.fail(err.message)))
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
  highPriorityLoadTokenBalanceEpic,
  loadTokenBalanceEpic,
  loadTezosBalanceEpic,
  loadTokensWithBalancesEpic,
  sendAssetEpic,
  waitForOperationCompletionEpic,
  addTokenMetadataEpic
);
