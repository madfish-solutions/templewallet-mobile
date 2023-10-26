import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { uniq } from 'lodash-es';
import { combineEpics } from 'redux-observable';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, concatMap, delay, map, switchMap } from 'rxjs/operators';
import { Action } from 'ts-action';
import { ofType, toPayload } from 'ts-action-operators';

import { fetchTzProfilesInfo$ } from 'src/apis/objkt';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { TokenBalanceResponse } from 'src/interfaces/token-balance-response.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { isDefined } from 'src/utils/is-defined';
import { isDcpNode } from 'src/utils/network.utils';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import {
  loadAssetBalance$,
  loadTokensBalancesArrayFromTzkt$,
  loadTezosBalance$,
  loadTokensWithBalance$
} from 'src/utils/token-balance.utils';
import { getTransferParams$ } from 'src/utils/transfer-params.utils';
import { withSelectedAccount, withSelectedAccountState, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { BURN_ADDRESS } from '../../hooks/use-burn-collectible.hook';
import { withMetadataSlugs } from '../../utils/token-metadata.utils';
import { loadSelectedBakerActions } from '../baking/baking-actions';
import { navigateAction } from '../root-state.actions';
import { loadTokensMetadataAction } from '../tokens-metadata/tokens-metadata-actions';
import type { RootState } from '../types';

import {
  addTokenAction,
  highPriorityLoadTokenBalanceAction,
  loadTezosBalanceActions,
  loadTokensBalancesArrayActions,
  loadTokensActions,
  sendAssetActions,
  waitForOperationCompletionAction,
  loadTzProfileIfoAction
} from './wallet-actions';

const updateDataActions = () => [
  loadTezosBalanceActions.submit(),
  loadTokensActions.submit(),
  loadSelectedBakerActions.submit()
];

const highPriorityLoadTokenBalanceEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(highPriorityLoadTokenBalanceAction),
    toPayload(),
    withSelectedRpcUrl(state$),
    switchMap(([payload, selectedRpcUrl]) =>
      loadAssetBalance$(selectedRpcUrl, payload.publicKeyHash, payload.slug).pipe(
        map(balance =>
          isDefined(balance)
            ? loadTokensBalancesArrayActions.success({
                publicKeyHash: payload.publicKeyHash,
                data: [{ slug: payload.slug, balance }],
                selectedRpcUrl
              })
            : loadTokensBalancesArrayActions.fail(`${payload.slug} balance load FAILED`)
        )
      )
    )
  );

const loadTokensBalancesEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTokensBalancesArrayActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[_, selectedAccount], selectedRpcUrl]) =>
      loadTokensBalancesArrayFromTzkt$(selectedRpcUrl, selectedAccount.publicKeyHash).pipe(
        map(data =>
          loadTokensBalancesArrayActions.success({
            publicKeyHash: selectedAccount.publicKeyHash,
            data: data.filter((item): item is TokenBalanceResponse => isDefined(item.balance)),
            selectedRpcUrl
          })
        )
      )
    ),
    catchError(([selectedAccount]) =>
      of(loadTokensBalancesArrayActions.fail(`${selectedAccount.publicKeyHash} balance load SKIPPED`)).pipe(delay(5))
    )
  );

const loadTokensWithBalancesEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTokensActions.submit),
    withSelectedAccount(state$),
    withSelectedAccountState(state$),
    withMetadataSlugs(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[[[, selectedAccount], selectedAccountState], metadataRecord], selectedRpcUrl]) =>
      loadTokensWithBalance$(selectedRpcUrl, selectedAccount.publicKeyHash).pipe(
        concatMap(tokensWithBalance => {
          const tokensWithBalancesSlugs = tokensWithBalance.map(tokenWithBalance =>
            getTokenSlug({
              address: tokenWithBalance.token.contract.address,
              id: tokenWithBalance.token.tokenId
            })
          );

          const isTezosNode = !isDcpNode(selectedRpcUrl);
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          const tokensList = (isTezosNode ? selectedAccountState.tokensList : selectedAccountState.dcpTokensList) ?? [];

          const accountTokensSlugs = tokensList.map(token => token.slug);
          const existingMetadataSlugs = Object.keys(metadataRecord);

          const allTokensSlugs = uniq([...accountTokensSlugs, ...tokensWithBalancesSlugs]);
          const assetWithoutMetadataSlugs = allTokensSlugs.filter(x => !existingMetadataSlugs.includes(x));

          return [
            loadTokensActions.success(tokensWithBalancesSlugs),
            loadTokensMetadataAction(assetWithoutMetadataSlugs),
            loadTokensBalancesArrayActions.submit()
          ];
        }),
        catchError(err => of(loadTokensActions.fail(err.message)))
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
        map(opParams => {
          const modalTitle = receiverPublicKeyHash === BURN_ADDRESS ? 'Confirm Burn' : 'Confirm Send';

          return navigateAction(ModalsEnum.Confirmation, {
            type: ConfirmationTypeEnum.InternalOperations,
            opParams,
            modalTitle
          });
        })
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

const loadTzProfileInfoEpic = (action$: Observable<Action>, state$: Observable<RootState>) =>
  action$.pipe(
    ofType(loadTzProfileIfoAction.submit),
    withSelectedAccount(state$),
    switchMap(([_, address]) =>
      fetchTzProfilesInfo$(address.publicKeyHash).pipe(
        map(tzProfile => loadTzProfileIfoAction.success(tzProfile)),
        catchError(err => of(loadTzProfileIfoAction.fail(err.message)))
      )
    )
  );

export const walletEpics = combineEpics(
  highPriorityLoadTokenBalanceEpic,
  loadTokensBalancesEpic,
  loadTezosBalanceEpic,
  loadTokensWithBalancesEpic,
  sendAssetEpic,
  waitForOperationCompletionEpic,
  addTokenMetadataEpic,
  loadTzProfileInfoEpic
);
