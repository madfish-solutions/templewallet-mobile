import { Observable } from 'rxjs';
import { catchError, switchMap, withLatestFrom } from 'rxjs/operators';

import { ParamsWithKind } from '../interfaces/op-params.interface';
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

export const sendTransaction$ = (sender: WalletAccountInterface, opParams: ParamsWithKind[]) =>
  Shelter.getSigner$(sender.publicKeyHash).pipe(
    withLatestFrom(currentNetworkRpc$),
    switchMap(([signer, currentNetworkRpc]) => {
      const tezos = createTezosToolkit(currentNetworkRpc);
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
