import { validate } from '@temple-wallet/wallet-address-validator';
import { isAddress as isEvmAddress } from 'viem';

import { isSaplingAddress } from 'src/utils/sapling/address-utils';
import { isValidAddress as isTezosAddress } from 'src/utils/tezos.util';

export type AddressNetwork = 'Bitcoin' | 'EVM' | 'Sapling' | 'Tezos' | 'Tron';

const otherNetworks: Array<{ slug: string; name: 'Bitcoin' | 'Tron' }> = [
  { slug: 'trx', name: 'Tron' },
  { slug: 'btc', name: 'Bitcoin' }
];

export const getAddressNetwork = (address: string): AddressNetwork | undefined => {
  if (isSaplingAddress(address)) return 'Sapling';
  if (isTezosAddress(address)) return 'Tezos';
  if (isEvmAddress(address)) return 'EVM';

  return otherNetworks.find(({ slug }) => validate(address, slug))?.name;
};

export const getWrongNetworkAddressError = (address: string, expectedNetwork: AddressNetwork): string | undefined => {
  const enteredNetwork = getAddressNetwork(address);

  if (!enteredNetwork || enteredNetwork === expectedNetwork) {
    return undefined;
  }

  return `You entered the ${enteredNetwork} address. Please enter the ${expectedNetwork} address`;
};
