import { Action } from '@reduxjs/toolkit';
import { combineEpics, StateObservable } from 'redux-observable';
import { concat, EMPTY, from, Observable, of } from 'rxjs';
import { catchError, concatMap, endWith, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ConfirmationModalParams } from 'src/modals/confirmation-modal/confirmation-modal.params';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { Shelter } from 'src/shelter/shelter';
import { showErrorToast } from 'src/toast/toast.utils';
import { withSelectedAccount, withSelectedAccountHdIndex, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { navigateAction, navigateBackAction } from '../root-state.actions';
import { hideLoaderAction, showLoaderAction } from '../settings/settings-actions';
import type { AnyActionEpic, RootState } from '../types';
import { addHdAccountAction, loadTezosBalanceActions, setSelectedAccountAction } from '../wallet/wallet-actions';

import {
  cancelSaplingPreparationAction,
  clearSaplingCredentialsAction,
  loadSaplingCredentialsActions,
  loadSaplingTransactionHistoryActions,
  loadShieldedBalanceActions,
  prepareSaplingTransactionActions,
  PrepareSaplingTxPayload
} from './sapling-actions';
import { saplingService, clearSaplingServiceCache } from './sapling-service';

const withSaplingSpendingKey$ = (
  publicKeyHash: string,
  hdIndex: number | undefined,
  next: (sask: string) => Observable<Action>,
  error: (err: unknown) => Observable<Action>,
  cancel$?: Observable<unknown>
) =>
  Shelter.revealSaplingSpendingKey$(publicKeyHash).pipe(
    switchMap(sask => {
      if (sask) {
        return next(sask);
      }

      const restoreSaplingSpendingKey$ =
        hdIndex === undefined
          ? Shelter.restoreImportedAccountSaplingSpendingKey$(publicKeyHash)
          : Shelter.restoreHdAccountSaplingSpendingKey$(hdIndex);
      const cancelableRestore$ = cancel$
        ? restoreSaplingSpendingKey$.pipe(takeUntil(cancel$))
        : restoreSaplingSpendingKey$;

      return cancelableRestore$.pipe(
        switchMap(next),
        startWith(showLoaderAction()),
        endWith(hideLoaderAction()),
        catchError(err => concat(of(hideLoaderAction()), error(err)))
      );
    })
  );

const loadSaplingCredentialsEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadSaplingCredentialsActions.submit),
    withSelectedAccount(state$),
    withSelectedAccountHdIndex(state$),
    switchMap(([[, { publicKeyHash, type }], hdIndex]) => {
      if (type === AccountTypeEnum.WATCH_ONLY_DEBUG) {
        return of(
          loadSaplingCredentialsActions.fail({
            publicKeyHash,
            error: 'Cannot get sapling credentials for watch-only accounts'
          })
        );
      }

      return withSaplingSpendingKey$(
        publicKeyHash,
        hdIndex,
        sask =>
          from(saplingService.deriveCredentials(sask)).pipe(
            map(({ saplingAddress, viewingKey }) =>
              loadSaplingCredentialsActions.success({ publicKeyHash, saplingAddress, viewingKey })
            )
          ),
        err => {
          showErrorToast({
            description: err instanceof Error ? err.message : 'Failed to load sapling credentials'
          });

          return of(
            loadSaplingCredentialsActions.fail({
              publicKeyHash,
              error: err instanceof Error ? err.message : 'Unknown error'
            })
          );
        }
      );
    })
  );

const loadShieldedBalanceEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadShieldedBalanceActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[, selectedAccount], rpcUrl]) => {
      const saplingState = state$.value.sapling.accountsRecord[selectedAccount.publicKeyHash];

      if (saplingState?.viewingKey == null) {
        return EMPTY;
      }

      return from(saplingService.getShieldedBalance(saplingState.viewingKey, rpcUrl)).pipe(
        concatMap(balance =>
          of(
            loadShieldedBalanceActions.success({
              publicKeyHash: selectedAccount.publicKeyHash,
              balance
            })
          )
        ),
        catchError(err => {
          showErrorToast({ description: err instanceof Error ? err.message : 'Failed to load shielded balance' });

          return of(loadShieldedBalanceActions.fail(err instanceof Error ? err.message : 'Unknown error'));
        })
      );
    })
  );

const prepareSaplingTransactionEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(prepareSaplingTransactionActions.submit),
    toPayload(),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    withSelectedAccountHdIndex(state$),
    switchMap(([[[payload, selectedAccount], rpcUrl], hdIndex]) => {
      const cancelPreparation$ = action$.pipe(ofType(cancelSaplingPreparationAction));
      const confirmationParams: ConfirmationModalParams =
        payload.isRebalance === true
          ? {
              type: ConfirmationTypeEnum.RebalanceOperation,
              direction: payload.type === 'shield' ? 'shield' : 'unshield',
              amount: payload.amount
            }
          : {
              type: ConfirmationTypeEnum.InternalOperations,
              opParams: [],
              saplingAmount: payload.amount,
              saplingType: payload.type
            };

      return concat(
        of(navigateAction({ screen: ModalsEnum.Confirmation, params: confirmationParams })),
        withSaplingSpendingKey$(
          selectedAccount.publicKeyHash,
          hdIndex,
          sask =>
            from(prepareSaplingTx(sask, payload, selectedAccount.publicKeyHash, rpcUrl, state$)).pipe(
              takeUntil(cancelPreparation$),
              map(opParams => prepareSaplingTransactionActions.success(opParams))
            ),
          err => {
            showErrorToast({ description: err instanceof Error ? err.message : 'Failed to prepare transaction' });

            return from([
              prepareSaplingTransactionActions.fail(err instanceof Error ? err.message : 'Unknown error'),
              navigateBackAction()
            ]);
          },
          cancelPreparation$
        )
      );
    })
  );

async function prepareSaplingTx(
  sask: string,
  payload: PrepareSaplingTxPayload,
  publicKeyHash: string,
  rpcUrl: string,
  state$: StateObservable<RootState>
) {
  const { BigNumber } = await import('bignumber.js');
  const amount = new BigNumber(payload.amount);

  switch (payload.type) {
    case 'shield': {
      const saplingAddress =
        payload.recipientAddress || state$.value.sapling.accountsRecord[publicKeyHash]?.saplingAddress;

      if (saplingAddress == null) {
        throw new Error('Sapling address not available');
      }

      const result = await saplingService.prepareShieldTransaction({
        spendingKey: sask,
        saplingAddress,
        amount,
        rpcUrl,
        memo: payload.memo
      });

      return result.opParams;
    }
    case 'unshield': {
      const result = await saplingService.prepareUnshieldTransaction({
        spendingKey: sask,
        recipientPublicKeyHash: payload.recipientAddress,
        amount,
        rpcUrl
      });

      return result.opParams;
    }
    case 'transfer': {
      const result = await saplingService.prepareSaplingTransfer({
        spendingKey: sask,
        recipientSaplingAddress: payload.recipientAddress,
        amount,
        memo: payload.memo,
        rpcUrl
      });

      return result.opParams;
    }
    default:
      throw new Error(`Unknown sapling transaction type: ${payload.type}`);
  }
}

const loadSaplingTransactionHistoryEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadSaplingTransactionHistoryActions.submit),
    withSelectedAccount(state$),
    withSelectedRpcUrl(state$),
    switchMap(([[, selectedAccount], rpcUrl]) => {
      const saplingState = state$.value.sapling.accountsRecord[selectedAccount.publicKeyHash];

      if (saplingState?.viewingKey == null) {
        return EMPTY;
      }

      return from(saplingService.getTransactionHistory(saplingState.viewingKey, rpcUrl)).pipe(
        concatMap(history => {
          const allTransactions = [...history.incoming, ...history.outgoing].sort((a, b) => b.position - a.position);

          return of(
            loadSaplingTransactionHistoryActions.success({
              publicKeyHash: selectedAccount.publicKeyHash,
              transactions: allTransactions
            })
          );
        }),
        catchError(err => {
          showErrorToast({
            description: err instanceof Error ? err.message : 'Failed to load transaction history'
          });

          return of(loadSaplingTransactionHistoryActions.fail(err instanceof Error ? err.message : 'Unknown error'));
        })
      );
    })
  );

const clearCacheOnAccountSwitchEpic: AnyActionEpic = action$ =>
  action$.pipe(
    ofType(setSelectedAccountAction, clearSaplingCredentialsAction),
    map(() => {
      clearSaplingServiceCache();

      return { type: 'sapling/CACHE_CLEARED' };
    })
  );

const clearCacheOnLockEpic: AnyActionEpic = () =>
  Shelter.isLocked$.pipe(
    filter(isLocked => isLocked),
    map(() => {
      clearSaplingServiceCache();

      return { type: 'sapling/CACHE_CLEARED' };
    })
  );

const refreshBalanceAfterTxEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadTezosBalanceActions.success),
    withSelectedAccount(state$),
    filter(([, selectedAccount]) => {
      const { sapling } = state$.value;
      const saplingState = sapling.accountsRecord[selectedAccount.publicKeyHash];

      return Boolean(saplingState?.isCredentialsLoaded);
    }),
    map(() => loadShieldedBalanceActions.submit())
  );

const shouldAutoLoadCredentials = (state$: StateObservable<RootState>) => {
  const { wallet, sapling } = state$.value;
  const { selectedAccountPublicKeyHash, accounts } = wallet;
  const saplingState = sapling.accountsRecord[selectedAccountPublicKeyHash];
  const selectedAccount = accounts.find(account => account.publicKeyHash === selectedAccountPublicKeyHash);

  return (
    Boolean(selectedAccountPublicKeyHash) &&
    !saplingState?.isCredentialsLoaded &&
    !saplingState?.failedToLoadCredentials &&
    selectedAccount?.type !== AccountTypeEnum.WATCH_ONLY_DEBUG
  );
};

let prevLocked: boolean | undefined;
/** Auto-load sapling credentials when the app is unlocked */
const autoLoadCredentialsOnUnlockEpic: AnyActionEpic = (_action$, state$) =>
  Shelter.isLocked$.pipe(
    filter(isLocked => {
      if (isLocked === prevLocked) {
        return false;
      }

      prevLocked = isLocked;

      return !isLocked;
    }),
    filter(() => shouldAutoLoadCredentials(state$)),
    map(() => loadSaplingCredentialsActions.submit())
  );

/** Auto-load credentials when account is added or selected account changes */
const autoLoadCredentialsOnAccountSwitchEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(addHdAccountAction, setSelectedAccountAction),
    filter(() => shouldAutoLoadCredentials(state$)),
    map(() => loadSaplingCredentialsActions.submit())
  );

/** Auto-load shielded balance once credentials are successfully loaded */
const autoLoadBalanceAfterCredentialsEpic: AnyActionEpic = action$ =>
  action$.pipe(
    ofType(loadSaplingCredentialsActions.success),
    map(() => loadShieldedBalanceActions.submit())
  );

export const saplingEpics = combineEpics(
  loadSaplingCredentialsEpic,
  loadShieldedBalanceEpic,
  loadSaplingTransactionHistoryEpic,
  prepareSaplingTransactionEpic,
  clearCacheOnAccountSwitchEpic,
  clearCacheOnLockEpic,
  refreshBalanceAfterTxEpic,
  autoLoadCredentialsOnUnlockEpic,
  autoLoadCredentialsOnAccountSwitchEpic,
  autoLoadBalanceAfterCredentialsEpic
);
