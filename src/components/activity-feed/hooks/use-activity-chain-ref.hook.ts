import { useMemo } from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';

import { ActivityChainRef } from '../types';

export const useTezosChainRef = (chainId: string) =>
  useMemo<ActivityChainRef>(() => ({ chain: TempleChainKind.Tezos, chainId }), [chainId]);

export const useEvmChainRef = (chainId: number) =>
  useMemo<ActivityChainRef>(() => ({ chain: TempleChainKind.EVM, chainId }), [chainId]);
