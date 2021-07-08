import { WalletParamsWithKind } from '@taquito/taquito';
import { Observable } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

import { emptyWalletAccount, WalletAccountInterface } from '../interfaces/wallet-account.interface';
import { Shelter } from '../shelter/shelter';
import { WalletRootState } from '../store/wallet/wallet-state';
import { createTezosToolkit, currentNetworkRpc$ } from './network/network.util';

export const withSelectedAccount =
  <T>(state$: Observable<WalletRootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { wallet }): [T, WalletAccountInterface] => {
        const { selectedAccountPublicKeyHash, hdAccounts } = wallet;
        const selectedAccount =
          hdAccounts.find(({ publicKeyHash }) => publicKeyHash === selectedAccountPublicKeyHash) ?? emptyWalletAccount;

        return [value, selectedAccount];
      })
    );

export const sendTransaction$ = (sender: WalletAccountInterface, opParams: WalletParamsWithKind[]) =>
  Shelter.getSigner$(sender.publicKeyHash).pipe(
    withLatestFrom(currentNetworkRpc$),
    switchMap(([signer, currentNetworkRpc]) => {
      const tezos = createTezosToolkit(currentNetworkRpc);
      tezos.setSignerProvider(signer);

      return tezos.wallet.batch(opParams).send();
    })
  );
