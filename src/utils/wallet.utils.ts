import { Observable } from 'rxjs';
import { catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import { ParamsWithKind } from '../interfaces/op-params.interface';
import { emptyWalletAccount, WalletAccountInterface } from '../interfaces/wallet-account.interface';
import { Shelter } from '../shelter/shelter';
import { SettingsRootState } from '../store/settings/settings-state';
import { WalletRootState } from '../store/wallet/wallet-state';
import { TEZ_TOKEN_METADATA } from '../token/data/tokens-metadata';
import { TokenMetadataInterface } from '../token/interfaces/token-metadata.interface';
import { emptyToken, TokenInterface } from '../token/interfaces/token.interface';
import { createTezosToolkit } from './rpc/tezos-toolkit.utils';

export const withTokenList =
  <T>(state$: Observable<WalletRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (_, { wallet }): Record<string, TokenMetadataInterface> => wallet.tokensMetadata)
    );

export const withSelectedAccount =
  <T>(state$: Observable<WalletRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { wallet }): [T, WalletAccountInterface] => {
        const { selectedAccountPublicKeyHash, accounts } = wallet;
        const selectedAccount =
          accounts.find(({ publicKeyHash }) => publicKeyHash === selectedAccountPublicKeyHash) ?? emptyWalletAccount;

        return [value, selectedAccount];
      })
    );

export const withSelectedRpcUrl =
  <T>(state$: Observable<SettingsRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(withLatestFrom(state$, (value, { settings }): [T, string] => [value, settings.selectedRpcUrl]));

export const sendTransaction$ = (rpcUrl: string, sender: WalletAccountInterface, opParams: ParamsWithKind[]) =>
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

export const getTezosToken = (balance: string): TokenInterface => ({
  ...emptyToken,
  ...TEZ_TOKEN_METADATA,
  balance
});
