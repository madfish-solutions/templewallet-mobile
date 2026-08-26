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
import { getAccountAddressForTezos } from 'src/utils/account.utils';
import { sendErrorAnalyticsEvent } from 'src/utils/analytics/analytics.util';
import { MS_IN_SECOND } from 'src/utils/date.utils';
import { withUserAnalyticsCredentials } from 'src/utils/error-analytics-data.utils';
import { isDefined } from 'src/utils/is-defined';
import { BURN_ADDRESS } from 'src/utils/known-addresses';
import { createReadOnlyTezosToolkit } from 'src/utils/rpc/tezos-toolkit.utils';
import { loadAssetBalance$, fetchAllAssetsBalancesFromTzkt, loadTezosBalances$ } from 'src/utils/token-balance.utils';
import { getTransferParams$ } from 'src/utils/transfer-params.utils';
import { withAllAccounts, withOnRampOverlayState, withAccount } from 'src/utils/wallet.utils';

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
    withUserAnalyticsCredentials(state$),
    switchMap(([payload, userAnalyticsCredentials]) =>
      loadAssetBalance$(payload.publicKeyHash, payload.slug, userAnalyticsCredentials).pipe(
        map(balance =>
          isDefined(balance)
            ? loadAssetsBalancesActions.success({
                accountId: payload.accountId,
                publicKeyHash: payload.publicKeyHash,
                balances: { [payload.slug]: balance }
              })
            : loadAssetsBalancesActions.fail(`${payload.slug} balance load FAILED`)
        )
      )
    )
  );

const loadTokensBalancesEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadAssetsBalancesActions.submit),
    withAccount(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[_, selectedAccount], { isAnalyticsEnabled, userId, ABTestingCategory }]) => {
      const selectedTezosAddress = getAccountAddressForTezos(selectedAccount);

      if (!selectedTezosAddress) {
        return EMPTY;
      }

      return from(fetchAllAssetsBalancesFromTzkt(selectedTezosAddress)).pipe(
        map(data =>
          loadAssetsBalancesActions.success({
            accountId: selectedAccount.id,
            publicKeyHash: selectedTezosAddress,
            balances: data
          })
        ),
        catchError(err => {
          if (isAnalyticsEnabled) {
            sendErrorAnalyticsEvent('LoadTokensBalancesError', err, [selectedTezosAddress], {
              userId,
              ABTestingCategory
            });
          }

          return of(loadAssetsBalancesActions.fail(`${selectedTezosAddress} balance load SKIPPED`)).pipe(delay(5));
        })
      );
    })
  );

const loadTezosBalanceEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadTezosBalanceActions.submit),
    withAllAccounts(state$),
    withAccount(state$),
    withUserAnalyticsCredentials(state$),
    switchMap(([[[, allAccounts], selectedAccount], { isAnalyticsEnabled, userId, ABTestingCategory }]) =>
      loadTezosBalances$(allAccounts.map(getAccountAddressForTezos).filter(isDefined)).pipe(
        withOnRampOverlayState(state$),
        concatMap(([balances, overlayState]) => {
          const balancesByAccountId = allAccounts.reduce<StringRecord>((acc, account) => {
            const tezosAddress = getAccountAddressForTezos(account);
            const balance = tezosAddress ? balances[tezosAddress] : undefined;

            if (isDefined(balance)) {
              acc[account.id] = balance;
            }

            return acc;
          }, {});
          const successAction = loadTezosBalanceActions.success(balancesByAccountId);
          const selectedTezosAddress = getAccountAddressForTezos(selectedAccount);
          const balance = selectedTezosAddress ? balances[selectedTezosAddress] : undefined;
          const showOnRampAction =
            !LIMIT_FIN_FEATURES &&
            overlayState === OnRampOverlayState.Closed &&
            isDefined(balance) &&
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
              [getAccountAddressForTezos(selectedAccount) ?? selectedAccount.id],
              { userId, ABTestingCategory }
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
    withAccount(state$),
    switchMap(([{ asset, receiverPublicKeyHash, amount }, selectedAccount]) => {
      if (!getAccountAddressForTezos(selectedAccount)) {
        showErrorToast({ description: 'Select a Tezos account to send this asset' });

        return EMPTY;
      }

      return getTransferParams$(asset, undefined, selectedAccount, receiverPublicKeyHash, new BigNumber(amount)).pipe(
        map((transferParams): ParamsWithKind[] => [{ ...transferParams, kind: OpKind.TRANSACTION }]),
        map(opParams => {
          const modalTitle = receiverPublicKeyHash === BURN_ADDRESS ? 'Confirm Burn' : 'Confirm Send';

          return navigateAction({
            screen: ModalsEnum.Confirmation,
            params: {
              type: ConfirmationTypeEnum.InternalOperations,
              opParams,
              modalTitle
            }
          });
        })
      );
    })
  );

const waitForOperationCompletionEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(waitForOperationCompletionAction),
    toPayload(),
    withUserAnalyticsCredentials(state$),
    switchMap(([{ opHash, sender }, { isAnalyticsEnabled, userId, ABTestingCategory }]) => {
      const tezos = createReadOnlyTezosToolkit(sender);

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
              sendErrorAnalyticsEvent('WaitForOperationCompletionEpicError', err, [sender.address], {
                userId,
                ABTestingCategory
              });
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
