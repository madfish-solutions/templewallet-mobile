import { ParamsWithKind } from '@taquito/taquito';
import { useMemo } from 'react';
import { Observable } from 'rxjs';
import { catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import type { RootState } from 'src/store/types';

import { AccountStateInterface, emptyAccountState } from '../interfaces/account-state.interface';
import { AccountInterface, emptyAccount } from '../interfaces/account.interface';
import { Shelter } from '../shelter/shelter';
import { ExchangeRateRecord } from '../store/currency/currency-state';
import { useTokenMetadataSelector } from '../store/tokens-metadata/tokens-metadata-selectors';
import { TEZ_TOKEN_SLUG } from '../token/data/tokens-metadata';
import { emptyToken } from '../token/interfaces/token.interface';
import { createTezosToolkit } from './rpc/tezos-toolkit.utils';

export const withSelectedAccount =
  <T>(state$: Observable<RootState>) =>
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
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { wallet }): [T, AccountStateInterface] => {
        const selectedAccountState =
          wallet.accountsStateRecord[wallet.selectedAccountPublicKeyHash] ?? emptyAccountState;

        return [value, selectedAccountState];
      })
    );

export const withSelectedRpcUrl =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(withLatestFrom(state$, (value, { settings }): [T, string] => [value, settings.selectedRpcUrl]));

export const withUsdToTokenRates =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { currency }): [T, ExchangeRateRecord] => [value, currency.usdToTokenRates.data])
    );

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
  const metadata = useTokenMetadataSelector(TEZ_TOKEN_SLUG);

  return useMemo(
    () => ({
      ...emptyToken,
      ...metadata,
      balance
    }),
    [metadata, balance]
  );
};
