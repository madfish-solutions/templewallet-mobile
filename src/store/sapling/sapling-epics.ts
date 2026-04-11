import { combineEpics, StateObservable } from 'redux-observable';
import { concat, EMPTY, firstValueFrom, from, of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ConfirmationModalParams } from 'src/modals/confirmation-modal/confirmation-modal.params';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { Shelter } from 'src/shelter/shelter';
import { showErrorToast } from 'src/toast/toast.utils';
import { withSelectedAccount, withSelectedAccountHdIndex, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { navigateAction, navigateBackAction } from '../root-state.actions';
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

/** Reads the sapling spending key (sask) from the keychain. */
function getSaplingSpendingKey$(publicKeyHash: string, hdAccountIndex?: number) {
  return Shelter.revealSaplingSpendingKey$(publicKeyHash).pipe(
    switchMap(sask => {
      if (sask) {
        return of(sask);
      }

      if (hdAccountIndex === undefined) {
        throw new Error('Sapling spending key not found');
      }

      return Shelter.restoreSaplingSpendingKey$(hdAccountIndex);
    })
  );
}

const loadSaplingCredentialsEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadSaplingCredentialsActions.submit),
    withSelectedAccount(state$),
    withSelectedAccountHdIndex(state$),
    switchMap(([[, { publicKeyHash }], hdIndex]) =>
      getSaplingSpendingKey$(publicKeyHash, hdIndex).pipe(
        switchMap(sask => from(saplingService.deriveCredentials(sask))),
        map(({ saplingAddress, viewingKey }) =>
          loadSaplingCredentialsActions.success({ publicKeyHash, saplingAddress, viewingKey })
        ),
        catchError(err => {
          showErrorToast({ description: err instanceof Error ? err.message : 'Failed to load sapling credentials' });

          return of(loadSaplingCredentialsActions.fail(err instanceof Error ? err.message : 'Unknown error'));
        })
      )
    )
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
        from(prepareSaplingTx(payload, selectedAccount.publicKeyHash, rpcUrl, state$, hdIndex)).pipe(
          takeUntil(action$.pipe(ofType(cancelSaplingPreparationAction))),
          map(opParams => prepareSaplingTransactionActions.success(opParams)),
          catchError(err => {
            showErrorToast({ description: err instanceof Error ? err.message : 'Failed to prepare transaction' });

            return from([
              prepareSaplingTransactionActions.fail(err instanceof Error ? err.message : 'Unknown error'),
              navigateBackAction()
            ]);
          })
        )
      );
    })
  );

async function prepareSaplingTx(
  payload: PrepareSaplingTxPayload,
  publicKeyHash: string,
  rpcUrl: string,
  state$: StateObservable<RootState>,
  hdAccountIndex?: number
) {
  const sask = await firstValueFrom(getSaplingSpendingKey$(publicKeyHash, hdAccountIndex));

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
    filter(() => {
      const pkh = state$.value.wallet.selectedAccountPublicKeyHash;
      const saplingState = state$.value.sapling.accountsRecord[pkh];

      return Boolean(saplingState?.isCredentialsLoaded);
    }),
    map(() => loadShieldedBalanceActions.submit())
  );

/** Auto-load sapling credentials when the app is unlocked */
const autoLoadCredentialsOnUnlockEpic: AnyActionEpic = (_action$, state$) =>
  Shelter.isLocked$.pipe(
    filter(isLocked => !isLocked),
    filter(() => {
      const pkh = state$.value.wallet.selectedAccountPublicKeyHash;
      const saplingState = state$.value.sapling.accountsRecord[pkh];

      return Boolean(pkh) && !saplingState?.isCredentialsLoaded;
    }),
    map(() => loadSaplingCredentialsActions.submit())
  );

/** Auto-load credentials when account is added or selected account changes */
const autoLoadCredentialsOnAccountSwitchEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(addHdAccountAction, setSelectedAccountAction),
    filter(() => Boolean(state$.value.wallet.selectedAccountPublicKeyHash)),
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
