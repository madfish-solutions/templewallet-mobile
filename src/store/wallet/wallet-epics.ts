import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { Action } from 'redux';
import { Epic, combineEpics } from 'redux-observable';
import { EMPTY, from, of } from 'rxjs';
import { catchError, delay, map, switchMap } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { TokenBalanceResponse } from 'src/interfaces/token-balance-response.interface';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import { isDefined } from 'src/utils/is-defined';
import { BURN_ADDRESS } from 'src/utils/known-addresses';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { loadAssetBalance$, loadTokensBalancesArrayFromTzkt$, loadTezosBalance$ } from 'src/utils/token-balance.utils';
import { getTransferParams$ } from 'src/utils/transfer-params.utils';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { navigateAction } from '../root-state.actions';
import type { RootState } from '../types';

import {
  highPriorityLoadTokenBalanceAction,
  loadTezosBalanceActions,
  loadTokensBalancesArrayActions,
  sendAssetActions,
  waitForOperationCompletionAction
} from './wallet-actions';

const highPriorityLoadTokenBalanceEpic: Epic<Action, Action, RootState> = (action$, state$) =>
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

const loadTokensBalancesEpic: Epic<Action, Action, RootState> = (action$, state$) =>
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

const loadTezosBalanceEpic: Epic<Action, Action, RootState> = (action$, state$) =>
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

const sendAssetEpic: Epic<Action, Action, RootState> = (action$, state$) =>
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

const waitForOperationCompletionEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(waitForOperationCompletionAction),
    toPayload(),
    withSelectedRpcUrl(state$),
    switchMap(([{ opHash, sender }, rpcUrl]) =>
      from(createReadOnlyTezosToolkit(rpcUrl, sender).operation.createOperation(opHash)).pipe(
        switchMap(operation => operation.confirmation(1)),
        // delay(BCD_INDEXING_DELAY),
        // concatMap(updateDataActions),
        switchMap(() => EMPTY),
        catchError(err => {
          if (err.message !== 'Confirmation polling timed out') {
            showErrorToast({ description: err?.message ?? 'Confirmation error' });
          }

          return EMPTY;
        })
      )
    )
  );

export const walletEpics = combineEpics(
  highPriorityLoadTokenBalanceEpic,
  loadTokensBalancesEpic,
  loadTezosBalanceEpic,
  sendAssetEpic,
  waitForOperationCompletionEpic
);
