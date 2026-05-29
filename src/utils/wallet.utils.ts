import { ParamsWithKind } from '@taquito/taquito';
import { useMemo } from 'react';
import { Observable } from 'rxjs';
import { catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { OnRampOverlayState } from 'src/enums/on-ramp-overlay-state.enum';
import { VisibilityEnum } from 'src/enums/visibility.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { Shelter } from 'src/shelter/shelter';
import { ExchangeRateRecord } from 'src/store/currency/currency-state';
import { useAssetExchangeRate, useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import type { RootState } from 'src/store/types';
import {
  useCurrentAccountTezosBalance,
  useTezosBalanceOfKnownAccountSelector
} from 'src/store/wallet/wallet-selectors';
import { WalletState } from 'src/store/wallet/wallet-state.ts';
import { TEZ_TOKEN_SLUG } from 'src/token/data/tokens-metadata';
import { TokenInterface } from 'src/token/interfaces/token.interface';

import { getAccountId } from './account.utils';
import { AnalyticsError } from './error-analytics-data.utils';
import { getNetworkGasTokenMetadata } from './network.utils';
import { createTezosToolkit } from './rpc/tezos-toolkit.utils';

export const withAccount =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { wallet }): [T, Account] => {
        const account = getSelectedAccountFromWallet(wallet);

        return [value, account];
      })
    );

export const withAllAccounts =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(withLatestFrom(state$, (value, { wallet }): [T, Account[]] => [value, wallet.accounts]));

export const withSelectedAccountHdIndex =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { wallet }): [T, number | undefined] => {
        const selectedAccount = getSelectedAccountFromWallet(wallet);

        if (selectedAccount.type !== AccountTypeEnum.HD_ACCOUNT) {
          return [value, undefined];
        }

        if (selectedAccount.hdIndex !== undefined) {
          return [value, selectedAccount.hdIndex];
        }

        const selectedAccountId = getAccountId(selectedAccount);
        const hdAccounts = wallet.accounts.filter(account => account.type === AccountTypeEnum.HD_ACCOUNT);
        const hdIndex = hdAccounts.findIndex(account => getAccountId(account) === selectedAccountId);

        return [value, hdIndex];
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
  Shelter.getTezosSigner$(senderPkh).pipe(
    switchMap(signer => {
      const tezos = createTezosToolkit(rpcUrl);
      tezos.setSignerProvider(signer);

      return tezos.contract.batch(opParams).send();
    }),
    catchError(err => {
      const makeAnalyticsError = (message?: string) =>
        new AnalyticsError(err, [senderPkh], { rpcUrl, opParams }, message);

      try {
        const errorBody = JSON.parse(err.body);
        if (Array.isArray(errorBody) && errorBody[0]?.id?.includes('empty_implicit_contract')) {
          throw makeAnalyticsError('The balance of TEZ is not enough to make a transaction.');
        }
      } catch {}

      if (typeof err?.body === 'string' && /<\s*html/i.test(err.body)) {
        throw makeAnalyticsError('Http error: unknown html response. Change RPC and try again');
      }

      throw makeAnalyticsError();
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

export const getSelectedAccountFromWallet = (wallet: WalletState) =>
  wallet.accounts.find(account => account.id === wallet.selectedAccountId) ?? wallet.accounts[0];
