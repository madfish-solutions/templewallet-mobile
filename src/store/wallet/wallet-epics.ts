import { OpKind } from '@taquito/rpc';
import { ParamsWithKind } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';
import { combineEpics } from 'redux-observable';
import { EMPTY, from, of } from 'rxjs';
import { catchError, delay, map, switchMap, concatMap } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { BLOCK_DURATION } from 'src/config/fixed-times';
import { LIMIT_FIN_FEATURES } from 'src/config/system';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { showErrorToast } from 'src/toast/toast.utils';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { MS_IN_SECOND } from 'src/utils/date.utils';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { isDefined } from 'src/utils/is-defined';
import { BURN_ADDRESS } from 'src/utils/known-addresses';
import { isDcpNode } from 'src/utils/network.utils';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { loadAssetBalance$, loadTezosBalance$, fetchAllAssetsBalancesFromTzkt } from 'src/utils/token-balance.utils';
import { getTransferParams$ } from 'src/utils/transfer-params.utils';
import { withOnRampOverlayState, withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { navigateAction } from '../root-state.actions';
import { setOnRampOverlayStateAction } from '../settings/settings-actions';
import type { AnyActionEpic } from '../types';

import {
  highPriorityLoadTokenBalanceAction,
  loadTezosBalanceActions,
  loadAssetsBalancesActions,
  sendAssetActions,
  waitForOperationCompletionAction
} from './wallet-actions';

const highPriorityLoadTokenBalanceEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(highPriorityLoadTokenBalanceAction),
    toPayload(),
    withSelectedRpcUrl(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[payload, selectedRpcUrl], userAnalyticsCredentials]) =>
      loadAssetBalance$(selectedRpcUrl, payload.publicKeyHash, payload.slug, userAnalyticsCredentials).pipe(
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

const loadTokensBalancesEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadAssetsBalancesActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[[_, selectedAccount], selectedRpcUrl], { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      from(fetchAllAssetsBalancesFromTzkt(selectedRpcUrl, selectedAccount.publicKeyHash)).pipe(
        map(data =>
          loadAssetsBalancesActions.success({
            publicKeyHash: selectedAccount.publicKeyHash,
            balances: data,
            selectedRpcUrl
          })
        ),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadTokensBalancesError',
              err,
              [selectedAccount.publicKeyHash],
              { userId, ABTestingCategory },
              { selectedRpcUrl }
            );
          }

          return of(loadAssetsBalancesActions.fail(`${selectedAccount.publicKeyHash} balance load SKIPPED`)).pipe(
            delay(5)
          );
        })
      )
    )
  );

const loadTezosBalanceEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadTezosBalanceActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[[, selectedAccount], rpcUrl], { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      loadTezosBalance$(rpcUrl, selectedAccount.publicKeyHash).pipe(
        withOnRampOverlayState(state$),
        concatMap(([balance, overlayState]) => {
          const successAction = loadTezosBalanceActions.success(balance);
          const showOnRampAction =
            !LIMIT_FIN_FEATURES &&
            !isDcpNode(rpcUrl) &&
            overlayState === OnRampOverlayState.Closed &&
            new BigNumber(balance).isZero()
              ? setOnRampOverlayStateAction(OnRampOverlayState.Start)
              : null;

          return showOnRampAction ? [successAction, showOnRampAction] : [successAction];
        }),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent(
              'LoadTezosBalanceError',
              err,
              [selectedAccount.publicKeyHash],
              { userId, ABTestingCategory },
              { rpcUrl }
            );
          }

          return of(loadTezosBalanceActions.fail(err.message));
        })
      )
    )
  );

const sendAssetEpic: AnyActionEpic = (action$, state$) =>
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

const waitForOperationCompletionEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(waitForOperationCompletionAction),
    toPayload(),
    withSelectedRpcUrl(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[{ opHash, sender }, rpcUrl], { isAnalyticsEnabled, userId, ABTestingCategory }]) => {
      const tezos = createReadOnlyTezosToolkit(rpcUrl, sender);

      return from(
        Promise.all([tezos.operation.createOperation(opHash), tezos.rpc.getConstants()]).then(
          ([operation, constants]) => Promise.all([operation.confirmation(1), Promise.resolve(constants)])
        )
      ).pipe(
        catchError(err => {
          if (err.message === 'Confirmation polling timed out') {
            return of(undefined);
          } else {
            if (isAnalyticsEnabled) {
              sendErrorAnalyticsEvent(
                'WaitForOperationCompletionEpicError',
                err,
                [sender.publicKeyHash],
                { userId, ABTestingCategory },
                { rpcUrl }
              );
            }

            throw new Error(err.message);
          }
        }),
        switchMap(results => {
          const rawDelay = results && results[1].minimal_block_delay;

          return of(true).pipe(
            delay(rawDelay ? rawDelay.toNumber() * MS_IN_SECOND : BLOCK_DURATION),
            concatMap(() => [loadTezosBalanceActions.submit(), loadAssetsBalancesActions.submit()])
          );
        }),
        catchError(err => {
          showErrorToast({ description: err.message });

          return EMPTY;
        })
      );
    })
  );

export const walletEpics = combineEpics(
  highPriorityLoadTokenBalanceEpic,
  loadTokensBalancesEpic,
  loadTezosBalanceEpic,
  sendAssetEpic,
  waitForOperationCompletionEpic
);
