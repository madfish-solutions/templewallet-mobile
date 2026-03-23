import { combineEpics } from 'redux-observable';
import { concat, EMPTY, from, of } from 'rxjs';
import { catchError, concatMap, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { ofType, toPayload } from 'ts-action-operators';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { ConfirmationTypeEnum } from 'src/interfaces/confirm-payload/confirmation-type.enum';
import { ConfirmationModalParams } from 'src/modals/confirmation-modal/confirmation-modal.params';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { Shelter } from 'src/shelter/shelter';
import { showErrorToast } from 'src/toast/toast.utils';
import { getMnemonicFromSecretKey } from 'src/utils/sapling/secret-key-to-mnemonic';
import { withSelectedAccount, withSelectedRpcUrl } from 'src/utils/wallet.utils';

import { navigateAction, navigateBackAction } from '../root-state.actions';
import type { AnyActionEpic } from '../types';
import { addHdAccountAction, loadTezosBalanceActions, setSelectedAccountAction } from '../wallet/wallet-actions';

import {
  cancelSaplingPreparationAction,
  clearSaplingCredentialsAction,
  loadSaplingCredentialsActions,
  loadShieldedBalanceActions,
  prepareSaplingTransactionActions,
  PrepareSaplingTxPayload
} from './sapling-actions';
import { saplingService, clearSaplingServiceCache } from './sapling-service';

/**
 * Resolves the sapling mnemonic for any account type:
 * - HD accounts: wallet seed phrase and HD index
 * - Imported accounts: private key bytes used as BIP39 entropy (no HD index)
 */
function getSaplingMnemonic(
  selectedAccount: { publicKeyHash: string; type: string },
  allAccounts: Array<{ publicKeyHash: string; type: string }>
): Promise<{ mnemonic: string; hdIndex?: number }> {
  if (selectedAccount.type === AccountTypeEnum.HD_ACCOUNT) {
    return new Promise((resolve, reject) => {
      Shelter.revealSeedPhrase$().subscribe({
        next: mnemonic => {
          if (mnemonic) {
            const hdAccounts = allAccounts.filter(a => a.type === AccountTypeEnum.HD_ACCOUNT);
            const hdIndex = hdAccounts.findIndex(a => a.publicKeyHash === selectedAccount.publicKeyHash);

            resolve({ mnemonic, hdIndex: hdIndex <= 0 ? undefined : hdIndex });
          }
        },
        error: reject
      });
    });
  }

  return new Promise((resolve, reject) => {
    Shelter.revealSecretKey$(selectedAccount.publicKeyHash).subscribe({
      next: secretKey => {
        if (secretKey != null) {
          resolve({ mnemonic: getMnemonicFromSecretKey(secretKey) });
        }
      },
      error: reject
    });
  });
}

const loadSaplingCredentialsEpic: AnyActionEpic = (action$, state$) =>
  action$.pipe(
    ofType(loadSaplingCredentialsActions.submit),
    withSelectedAccount(state$),
    switchMap(([, selectedAccount]) => {
      return from(
        getSaplingMnemonic(selectedAccount, state$.value.wallet.accounts).then(async ({ mnemonic, hdIndex }) => {
          const credentials = await saplingService.deriveCredentials(mnemonic, hdIndex);

          return loadSaplingCredentialsActions.success({
            publicKeyHash: selectedAccount.publicKeyHash,
            saplingAddress: credentials.saplingAddress,
            viewingKey: credentials.viewingKey
          });
        })
      ).pipe(
        catchError(err => {
          showErrorToast({ description: err instanceof Error ? err.message : 'Failed to load sapling credentials' });

          return of(loadSaplingCredentialsActions.fail(err instanceof Error ? err.message : 'Unknown error'));
        })
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
    switchMap(([[payload, selectedAccount], rpcUrl]) => {
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
        from(prepareSaplingTx(payload, selectedAccount.publicKeyHash, rpcUrl, state$)).pipe(
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
  state$: {
    value: {
      sapling: { accountsRecord: Record<string, { saplingAddress: string | null }> };
      wallet: { accounts: Array<{ publicKeyHash: string; type: string }> };
    };
  }
) {
  const selectedAccount = state$.value.wallet.accounts.find(a => a.publicKeyHash === publicKeyHash);

  if (!selectedAccount) {
    throw new Error('Account not found');
  }

  const saplingMnemonic = await getSaplingMnemonic(selectedAccount, state$.value.wallet.accounts);

  const { BigNumber } = await import('bignumber.js');
  const amount = new BigNumber(payload.amount);

  switch (payload.type) {
    case 'shield': {
      const saplingAddress = state$.value.sapling.accountsRecord[publicKeyHash]?.saplingAddress;

      if (saplingAddress == null) {
        throw new Error('Sapling address not available');
      }

      const result = await saplingService.prepareShieldTransaction({
        mnemonic: saplingMnemonic.mnemonic,
        hdIndex: saplingMnemonic.hdIndex,
        saplingAddress,
        amount,
        rpcUrl
      });

      return result.opParams;
    }
    case 'unshield': {
      const result = await saplingService.prepareUnshieldTransaction({
        mnemonic: saplingMnemonic.mnemonic,
        hdIndex: saplingMnemonic.hdIndex,
        recipientPublicKeyHash: payload.recipientAddress,
        amount,
        rpcUrl
      });

      return result.opParams;
    }
    case 'transfer': {
      const result = await saplingService.prepareSaplingTransfer({
        mnemonic: saplingMnemonic.mnemonic,
        hdIndex: saplingMnemonic.hdIndex,
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

      return clearSaplingCredentialsAction();
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
  prepareSaplingTransactionEpic,
  clearCacheOnAccountSwitchEpic,
  clearCacheOnLockEpic,
  refreshBalanceAfterTxEpic,
  autoLoadCredentialsOnUnlockEpic,
  autoLoadCredentialsOnAccountSwitchEpic,
  autoLoadBalanceAfterCredentialsEpic
);
