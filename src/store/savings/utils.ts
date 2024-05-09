import { from, of, map, switchMap } from 'rxjs';

import { getKordFiUserDeposits$ } from 'src/apis/kord-fi';
import { getUserStake } from 'src/apis/youves';
import { EarnOpportunityTypeEnum } from 'src/enums/earn-opportunity-type.enum';
import { AccountInterface } from 'src/interfaces/account.interface';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';

export const loadSingleSavingStake$ = (savingsItem: SavingsItem, selectedAccount: AccountInterface, rpcUrl: string) =>
  of(savingsItem).pipe(
    switchMap(item => {
      switch (item.type) {
        case EarnOpportunityTypeEnum.KORD_FI_SAVING:
          return getKordFiUserDeposits$(selectedAccount.publicKeyHash).pipe(
            map(deposits => deposits[item.contractAddress])
          );
        default:
          return from(getUserStake(selectedAccount, item.id, item.type, rpcUrl));
      }
    })
  );
