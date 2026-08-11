import { EvmChainSpecs } from 'src/types/networks';

export const toEvmCaipChainId = (chainId: number) => `eip155:${chainId}`;

export const parseEvmCaipChainId = (caipChainId: string): number | undefined => {
  const match = /^eip155:(\d+)$/.exec(caipChainId);

  return match ? Number(match[1]) : undefined;
};

export const getEvmNetworkLabel = (caipChainId: string, evmChainsSpecs: EvmChainSpecs[]) => {
  const chainId = parseEvmCaipChainId(caipChainId);

  if (chainId === undefined) {
    return caipChainId;
  }

  return evmChainsSpecs.find(specs => specs.chainId === chainId)?.name ?? caipChainId;
};
