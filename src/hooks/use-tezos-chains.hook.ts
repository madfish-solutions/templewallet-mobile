import { ChainIds } from '@taquito/taquito';
import { useMemo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import {
  DEFAULT_TEZOS_RPCS,
  DEFAULT_TEZOS_BLOCK_EXPLORERS,
  TezosChain,
  DEFAULT_MAINNET_TEZOS_CHAIN_SPECS
} from 'src/types/networks';

const { activeBlockExplorerId, activeRpcId, ...mainnetTezosChainSpecs } = DEFAULT_MAINNET_TEZOS_CHAIN_SPECS;
const mainnetTezosChain: TezosChain = {
  ...mainnetTezosChainSpecs,
  kind: TempleChainKind.Tezos,
  chainId: ChainIds.MAINNET,
  allRpcs: DEFAULT_TEZOS_RPCS,
  allBlockExplorers: DEFAULT_TEZOS_BLOCK_EXPLORERS,
  activeRpc: DEFAULT_TEZOS_RPCS[0],
  activeBlockExplorer: DEFAULT_TEZOS_BLOCK_EXPLORERS[0]
};

// TODO: Add selecting RPCs and block explorers from settings
export const useTezosChains = () => {
  return useMemo(() => [mainnetTezosChain], []);
};

export const useTezosChain = () => mainnetTezosChain;
