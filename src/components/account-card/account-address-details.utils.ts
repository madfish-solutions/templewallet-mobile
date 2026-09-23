import { GestureResponderEvent } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';

export interface AccountAddressDetails {
  address: string;
  network: CryptoLogoNameEnum;
  onPress?: (event?: GestureResponderEvent) => void;
}

export interface AccountAddressDetailsParams {
  account?: Account;
  contactAddress?: string;
  saplingAddress?: string | null;
  chainKind: TempleChainKind;
  isShieldedTez: boolean;
  showAllAddresses: boolean;
  onAddressPress?: (address: string, event?: GestureResponderEvent) => void;
}

const getNetworkName = (chainKind: TempleChainKind, isShieldedTez: boolean) =>
  isShieldedTez
    ? CryptoLogoNameEnum.ShieldedTezos
    : chainKind === TempleChainKind.Tezos
    ? CryptoLogoNameEnum.Tezos
    : CryptoLogoNameEnum.Etherlink;

export const getAccountAddressDetails = ({
  account,
  contactAddress,
  saplingAddress,
  chainKind,
  isShieldedTez,
  showAllAddresses,
  onAddressPress
}: AccountAddressDetailsParams): AccountAddressDetails[] => {
  const tezosAddress = account ? getAccountAddressForTezos(account) : undefined;
  const evmAddress = account ? getAccountAddressForEvm(account) : undefined;

  if (showAllAddresses) {
    return [
      tezosAddress ? { address: tezosAddress, network: CryptoLogoNameEnum.Tezos } : undefined,
      saplingAddress ? { address: saplingAddress, network: CryptoLogoNameEnum.ShieldedTezos } : undefined,
      evmAddress ? { address: evmAddress, network: CryptoLogoNameEnum.Etherlink } : undefined
    ]
      .filter(isDefined)
      .map(addressDetails => ({
        ...addressDetails,
        onPress: onAddressPress
          ? (event?: GestureResponderEvent) => onAddressPress(addressDetails.address, event)
          : undefined
      }));
  }

  const selectedAddress = contactAddress
    ? contactAddress
    : isShieldedTez
    ? saplingAddress
    : chainKind === TempleChainKind.Tezos
    ? tezosAddress
    : evmAddress;

  return selectedAddress ? [{ address: selectedAddress, network: getNetworkName(chainKind, isShieldedTez) }] : [];
};
