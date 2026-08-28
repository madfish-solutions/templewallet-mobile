import { Address } from 'viem';

import { EvmChainSpecs } from 'src/types/networks';

export const toEvmCaipChainId = (chainId: number) => `eip155:${chainId}`;

export const parseEvmCaipChainId = (caipChainId: string) => {
  const match = /^eip155:(\d+)$/.exec(caipChainId);

  return match ? Number(match[1]) : undefined;
};

export const parseEvmCaipAccountId = (caipAccountId: string): [number, Address] | undefined => {
  const match = /^eip155:(\d+):(0x[a-fA-F0-9]{40})$/.exec(caipAccountId);

  return match ? [Number(match[1]), match[2] as Address] : undefined;
};

export const toEvmCaipAccountId = (caipChainId: string, accountAddress: Address) =>
  `${caipChainId}:${accountAddress.toLowerCase()}`;

export const getEvmNetworkLabel = (caipChainId: string, evmChainsSpecs: EvmChainSpecs[]) => {
  const chainId = parseEvmCaipChainId(caipChainId);

  if (chainId === undefined) {
    return caipChainId;
  }

  return evmChainsSpecs.find(specs => specs.chainId === chainId)?.name ?? caipChainId;
};
