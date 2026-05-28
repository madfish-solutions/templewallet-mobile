import { from, of, switchMap } from 'rxjs';

import { getUserStake } from 'src/apis/youves';
import { Account } from 'src/interfaces/account.interfaces';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';

export const loadSingleSavingStake$ = (savingsItem: SavingsItem, selectedAccount: Account, rpcUrl: string) =>
  of(savingsItem).pipe(switchMap(item => from(getUserStake(selectedAccount, item.id, item.type, rpcUrl))));
