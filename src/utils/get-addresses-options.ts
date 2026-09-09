import { GestureResponderEvent } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';

import { getAccountAddressForEvm, getAccountAddressForTezos } from './account.utils';
import { isDefined } from './is-defined';

export const getAddressesOptions = (
  chainKind: TempleChainKind | undefined,
  isShieldedTez: boolean,
  saplingAddress: string | nullish,
  account: Account,
  handlePress?: (address: string, event?: GestureResponderEvent) => void
) => {
  const makeAddressOption = (address: string, network: CryptoLogoNameEnum) => ({
    address,
    network,
    onPress: handlePress ? (event?: GestureResponderEvent) => handlePress(address, event) : undefined
  });
  const tezosAddress = getAccountAddressForTezos(account);
  const evmAddress = getAccountAddressForEvm(account);

  if (chainKind === undefined) {
    return [
      tezosAddress ? makeAddressOption(tezosAddress, CryptoLogoNameEnum.Tezos) : undefined,
      saplingAddress && isShieldedTez ? makeAddressOption(saplingAddress, CryptoLogoNameEnum.ShieldedTezos) : undefined,
      evmAddress ? makeAddressOption(evmAddress, CryptoLogoNameEnum.Etherlink) : undefined
    ].filter(isDefined);
  }

  if (chainKind === TempleChainKind.Tezos && saplingAddress && isShieldedTez) {
    return [makeAddressOption(saplingAddress, CryptoLogoNameEnum.ShieldedTezos)];
  }

  if (chainKind === TempleChainKind.Tezos && tezosAddress) {
    return [makeAddressOption(tezosAddress, CryptoLogoNameEnum.Tezos)];
  }

  if (chainKind === TempleChainKind.EVM && evmAddress) {
    return [makeAddressOption(evmAddress, CryptoLogoNameEnum.Etherlink)];
  }

  return [];
};
