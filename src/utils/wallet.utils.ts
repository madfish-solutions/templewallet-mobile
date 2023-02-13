import { ParamsWithKind } from '@taquito/taquito';
import { useMemo } from 'react';
import { Observable } from 'rxjs';
import { catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import { AccountStateInterface, emptyAccountState } from 'src/interfaces/account-state.interface';
import { AccountInterface, emptyAccount } from 'src/interfaces/account.interface';
import { Shelter } from 'src/shelter/shelter';
import { useSelector } from 'src/store/selector';
import { SettingsRootState } from 'src/store/settings/settings-state';
import { WalletRootState } from 'src/store/wallet/wallet-state';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { emptyToken } from 'src/token/interfaces/token.interface';

import { getNetworkGasTokenMetadata } from './network.utils';
import { createTezosToolkit } from './rpc/tezos-toolkit.utils';
import { useGetTokenExchangeRate } from './token-metadata.utils';

export const withSelectedAccount =
  <T>(state$: Observable<WalletRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { wallet }): [T, AccountInterface] => {
        const selectedAccount =
          wallet.accounts.find(({ publicKeyHash }) => publicKeyHash === wallet.selectedAccountPublicKeyHash) ??
          emptyAccount;

        return [value, selectedAccount];
      })
    );

export const withSelectedAccountState =
  <T>(state$: Observable<WalletRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { wallet }): [T, AccountStateInterface] => {
        const selectedAccountState =
          wallet.accountsStateRecord[wallet.selectedAccountPublicKeyHash] ?? emptyAccountState;

        return [value, selectedAccountState];
      })
    );

export const withSelectedRpcUrl =
  <T>(state$: Observable<SettingsRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(withLatestFrom(state$, (value, { settings }): [T, string] => [value, settings.selectedRpcUrl]));

export const sendTransaction$ = (rpcUrl: string, sender: AccountInterface, opParams: ParamsWithKind[]) =>
  Shelter.getSigner$(sender.publicKeyHash).pipe(
    switchMap(signer => {
      const tezos = createTezosToolkit(rpcUrl);
      tezos.setSignerProvider(signer);

      return tezos.contract.batch(opParams).send();
    }),
    catchError(err => {
      if (JSON.parse(err.body)[0].id.indexOf('empty_implicit_contract') > -1) {
        throw new Error('The balance of TEZ is not enough to make a transaction.');
      }
      throw new Error(err.message);
    })
  );

export const useTezosToken = (balance: string) => {
  const selectedRpcUrl = useSelector(state => state.settings.selectedRpcUrl);
  const getTokenExchangeRate = useGetTokenExchangeRate();
  const exchangeRate = useMemo(() => getTokenExchangeRate(TEZ_TOKEN_SLUG), [getTokenExchangeRate]);

  const gasTokenMetadata = getNetworkGasTokenMetadata(selectedRpcUrl);

  return useMemo(
    () => ({
      ...emptyToken,
      ...gasTokenMetadata,
      exchangeRate,
      balance
    }),
    [gasTokenMetadata, exchangeRate, balance]
  );
};
