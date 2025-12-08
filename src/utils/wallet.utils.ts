import { ParamsWithKind } from '@taquito/taquito';
import { useMemo } from 'react';
import { Observable } from 'rxjs';
import { catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { AccountInterface, emptyAccount } from 'src/interfaces/account.interface';
import { Shelter } from 'src/shelter/shelter';
import { ExchangeRateRecord } from 'src/store/currency/currency-state';
import { useAssetExchangeRate, useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import type { RootState } from 'src/store/types';
import {
  useCurrentAccountTezosBalance,
  useTezosBalanceOfKnownAccountSelector
} from 'src/store/wallet/wallet-selectors';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { getNetworkGasTokenMetadata } from './network.utils';
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

export const withAccount =
  <T>(state$: Observable<RootState>, getAccountPkh: (value: T) => string) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { wallet }): [T, AccountInterface] => {
        const account =
          wallet.accounts.find(({ publicKeyHash }) => publicKeyHash === getAccountPkh(value)) ?? emptyAccount;

        return [value, account];
      })
    );

export const withOnRampOverlayState =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { settings }): [T, OnRampOverlayState] => [value, settings.onRampOverlayState])
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

export const sendTransaction$ = (rpcUrl: string, senderPkh: string, opParams: ParamsWithKind[]) =>
  Shelter.getSigner$(senderPkh).pipe(
    switchMap(signer => {
      const tezos = createTezosToolkit(rpcUrl);
      tezos.setSignerProvider(signer);

      return tezos.contract.batch(opParams).send();
    }),
    catchError(err => {
      try {
        const errorBody = JSON.parse(err.body);
        if (Array.isArray(errorBody) && errorBody[0]?.id?.includes('empty_implicit_contract')) {
          throw new Error('The balance of TEZ is not enough to make a transaction.');
        }
      } catch {}
      throw new Error(err.message);
    })
  );

export const useTezosToken = (balance: string) => {
  const selectedRpcUrl = useSelectedRpcUrlSelector();
  const metadata = getNetworkGasTokenMetadata(selectedRpcUrl);
  const exchangeRate = useAssetExchangeRate(TEZ_TOKEN_SLUG);

  return useMemo<TokenInterface>(
    () => ({
      visibility: VisibilityEnum.Visible,
      ...metadata,
      balance,
      exchangeRate
    }),
    [metadata, balance, exchangeRate]
  );
};

export const useTezosTokenOfCurrentAccount = () => {
  const balance = useCurrentAccountTezosBalance();

  return useTezosToken(balance);
};

export const useTezosTokenOfKnownAccount = (publicKeyHash: string) => {
  const balance = useTezosBalanceOfKnownAccountSelector(publicKeyHash);

  return useTezosToken(balance);
};
