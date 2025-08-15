import { from, of, switchMap } from 'rxjs';

import { getUserStake } from 'src/apis/youves';
import { AccountInterface } from 'src/interfaces/account.interface';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';

export const loadSingleSavingStake$ = (savingsItem: SavingsItem, selectedAccount: AccountInterface, rpcUrl: string) =>
  of(savingsItem).pipe(switchMap(item => from(getUserStake(selectedAccount, item.id, item.type, rpcUrl))));
