import { Observable } from 'rxjs';
import { withLatestFrom } from 'rxjs/operators';

import { emptyAccount } from '../../interfaces/account.interface';
import { RootState } from '../types';

export const withAccessToken =
  <T>(state$: Observable<RootState>) =>
  (observable$: Observable<T>) =>
    observable$.pipe(
      withLatestFrom(state$, (value, { wallet, textToNft }): [T, string | null] => {
        const selectedAccount =
          wallet.accounts.find(({ publicKeyHash }) => publicKeyHash === wallet.selectedAccountPublicKeyHash) ??
          emptyAccount;

        return [value, textToNft.accountsStateRecord[selectedAccount.publicKeyHash].accessToken];
      })
    );
