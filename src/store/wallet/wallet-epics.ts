import { OpKind, ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { Action } from 'redux';
import { Epic, combineEpics } from 'redux-observable';
import { EMPTY, from, of } from 'rxjs';
import { catchError, delay, map, switchMap, concatMap } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { BLOCK_DURATION } from 'src/config/fixed-times';
import { isAndroid } from 'src/config/system';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import { isDefined } from 'src/utils/is-defined';
import { BURN_ADDRESS } from 'src/utils/known-addresses';
import { isDcpNode } from 'src/utils/network.utils';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { loadAssetBalance$, loadTezosBalance$, fetchAllAssetsBalancesFromTzkt } from 'src/utils/token-balance.utils';
import { getTransferParams$ } from 'src/utils/transfer-params.utils';
import { withOnRampOverlayState, withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { navigateAction } from '../root-state.actions';
import { setOnRampOverlayStateAction } from '../settings/settings-actions';
import type { RootState } from '../types';

import {
  highPriorityLoadTokenBalanceAction,
  loadTezosBalanceActions,
  loadAssetsBalancesActions,
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
            ? loadAssetsBalancesActions.success({
                publicKeyHash: payload.publicKeyHash,
                balances: { slug: payload.slug, balance },
                selectedRpcUrl
              })
            : loadAssetsBalancesActions.fail(`${payload.slug} balance load FAILED`)
        )
      )
    )
  );

const loadTokensBalancesEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(loadAssetsBalancesActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[_, selectedAccount], selectedRpcUrl]) =>
      from(fetchAllAssetsBalancesFromTzkt(selectedRpcUrl, selectedAccount.publicKeyHash)).pipe(
        map(data =>
          loadAssetsBalancesActions.success({
            publicKeyHash: selectedAccount.publicKeyHash,
            balances: data,
            selectedRpcUrl
          })
        )
      )
    ),
    catchError(([selectedAccount]) =>
      of(loadAssetsBalancesActions.fail(`${selectedAccount.publicKeyHash} balance load SKIPPED`)).pipe(delay(5))
    )
  );

const loadTezosBalanceEpic: Epic<Action, Action, RootState> = (action$, state$) =>
  action$.pipe(
    ofType(loadTezosBalanceActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[, selectedAccount], rpcUrl]) =>
      loadTezosBalance$(rpcUrl, selectedAccount.publicKeyHash).pipe(
        withOnRampOverlayState(state$),
        concatMap(([balance, overlayState]) => {
          const successAction = loadTezosBalanceActions.success(balance);
          const showOnRampAction = setOnRampOverlayStateAction(OnRampOverlayState.Start);

          return new BigNumber(balance).isZero() &&
            isAndroid &&
            !isDcpNode(rpcUrl) &&
            overlayState === OnRampOverlayState.Closed
            ? [successAction, showOnRampAction]
            : [successAction];
        }),
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
        catchError(err => {
          if (err.message === 'Confirmation polling timed out') {
            return of(undefined);
          } else {
            throw new Error(err.message);
          }
        }),
        delay(BLOCK_DURATION),
        concatMap(() => [loadTezosBalanceActions.submit(), loadAssetsBalancesActions.submit()]),
        catchError(err => {
          showErrorToast({ description: err.message });

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
