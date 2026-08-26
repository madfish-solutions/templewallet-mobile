import { Account } from 'src/interfaces/account.interfaces.ts';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils.ts';

export const getSeedFromAccount = (account: Account) => {
  const tezosAddress = getAccountAddressForTezos(account);
  const evmAddress = getAccountAddressForEvm(account);

  return tezosAddress ?? evmAddress ?? '';
};
