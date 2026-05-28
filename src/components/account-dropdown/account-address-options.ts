import { AddressBookItem, Account } from 'src/interfaces/account.interfaces';
import { CopyAddressOption } from 'src/modals/copy-address-modal';
import { getAccountAddressForEvm, getAccountAddressForTezos, isAccount } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { isTruthy } from 'src/utils/is-truthy';

import { IconNameEnum } from '../icon/icon-name.enum';

const isAccountItem = (account: AddressBookItem): account is Account => isAccount(account);

export const buildAccountAddressOptions = (
  account: AddressBookItem | undefined,
  saplingAddress: string | null | undefined
): CopyAddressOption[] => {
  if (!isDefined(account)) {
    return [];
  }

  const tezosAddress = isAccountItem(account) ? getAccountAddressForTezos(account) : account.address;
  const evmAddress = isAccountItem(account) ? getAccountAddressForEvm(account) : undefined;

  return [
    isString(tezosAddress) && {
      label: 'Tezos',
      address: tezosAddress,
      iconName: IconNameEnum.TezToken
    },
    isString(saplingAddress) &&
      isAccountItem(account) &&
      getAccountAddressForTezos(account) !== undefined && {
        label: 'Shielded',
        address: saplingAddress,
        iconName: IconNameEnum.TezShieldedToken
      },
    isString(evmAddress) && {
      label: 'Etherlink',
      address: evmAddress,
      iconName: IconNameEnum.EtherlinkToken
    }
  ].filter(isTruthy);
};
