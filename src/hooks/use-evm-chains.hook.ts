import { useMemo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import {
  useCustomEvmBlockExplorersSelector,
  useEvmChainsSpecsSelector,
  useCustomEvmRpcsSelector
} from 'src/store/settings/settings-selectors';
import { DEFAULT_EVM_CURRENCY } from 'src/token/interfaces/token-metadata.interface';
import { DEFAULT_EVM_RPCS, DEFAULT_EVM_BLOCK_EXPLORERS, EvmChain } from 'src/types/networks';

export const useEvmChains = (): EvmChain[] => {
  const customEvmRpcs = useCustomEvmRpcsSelector();
  const customEvmBlockExplorers = useCustomEvmBlockExplorersSelector();
  const evmChainsSpecs = useEvmChainsSpecsSelector();

  return useMemo(
    () =>
      evmChainsSpecs.map(specs => {
        const { activeBlockExplorerId, activeRpcId, chainId, currency, ...restSpecs } = specs;
        const allRpcs = DEFAULT_EVM_RPCS[chainId].concat(customEvmRpcs[chainId] ?? []);
        const allBlockExplorers = DEFAULT_EVM_BLOCK_EXPLORERS[chainId].concat(customEvmBlockExplorers[chainId] ?? []);

        return {
          ...restSpecs,
          kind: TempleChainKind.EVM,
          currency: currency ?? DEFAULT_EVM_CURRENCY,
          chainId,
          activeRpc: allRpcs.find(x => x.id === activeRpcId) ?? allRpcs[0],
          activeBlockExplorer: allBlockExplorers.find(x => x.id === activeBlockExplorerId) ?? allBlockExplorers[0],
          allRpcs: allRpcs.concat(customEvmRpcs[chainId] ?? []),
          allBlockExplorers: allBlockExplorers.concat(customEvmBlockExplorers[chainId] ?? [])
        };
      }),
    [customEvmRpcs, customEvmBlockExplorers, evmChainsSpecs]
  );
};

export const useEvmChain = (chainId: EvmChain['chainId']) => {
  const evmChains = useEvmChains();

  return useMemo(() => evmChains.find(chain => chain.chainId === chainId), [evmChains, chainId]);
};
