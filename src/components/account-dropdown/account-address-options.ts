import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { AccountBaseInterface, AccountInterface } from 'src/interfaces/account.interface';
import { CopyAddressOption } from 'src/modals/copy-address-modal';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';
import { isTruthy } from 'src/utils/is-truthy';

import { IconNameEnum } from '../icon/icon-name.enum';

const isAccountInterface = (account: AccountBaseInterface): account is AccountInterface => 'type' in account;

export const buildAccountAddressOptions = (
  account: AccountBaseInterface | undefined,
  saplingAddress: string | null | undefined
): CopyAddressOption[] => {
  if (!isDefined(account)) {
    return [];
  }

  const tezosAddress = isAccountInterface(account) ? getAccountAddressForTezos(account) : account.publicKeyHash;
  const evmAddress = isAccountInterface(account) ? getAccountAddressForEvm(account) : undefined;

  return [
    isString(tezosAddress) && {
      label: 'Tezos',
      address: tezosAddress,
      iconName: IconNameEnum.TezToken
    },
    isString(saplingAddress) &&
      isAccountInterface(account) &&
      account.chain !== TempleChainKind.EVM && {
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
