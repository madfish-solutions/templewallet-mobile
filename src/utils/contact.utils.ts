import { isAddress as isEvmAddress } from 'viem';

import { isValidAddress as isTezosAddress } from 'src/utils/tezos.util';

export const isEvmContactAddress = (address: string) => isEvmAddress(address);

export const isTezosContactAddress = (address: string) => isTezosAddress(address);

export const isValidContactAddress = (address: string) =>
  isEvmContactAddress(address) || isTezosContactAddress(address);

export const truncateContactAddress = (address: string) =>
  address.length > 10 ? `${address.slice(0, 6)}...${address.slice(-4)}` : address;
