import { Account } from 'src/interfaces/account.interfaces';
import { getAccountAddressForEvm, hasEvmAddress } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';

export const hasEvmAccount = (accounts: Account[]) => accounts.some(account => hasEvmAddress(account));

export const resolveWcSessionRequestApprover = (
  accounts: Account[],
  selectedAccount?: Account,
  requestAddress?: string
) => {
  const evmAccounts = accounts.filter(hasEvmAddress);

  if (isDefined(requestAddress)) {
    return evmAccounts.find(
      candidate => getAccountAddressForEvm(candidate).toLowerCase() === requestAddress.toLowerCase()
    );
  }

  return selectedAccount && hasEvmAddress(selectedAccount) ? selectedAccount : evmAccounts[0];
};
