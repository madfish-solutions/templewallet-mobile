import { ChainIds } from '@taquito/taquito';

import { TempleChainKind } from '../enums/temple-chain-kind.enum';
import { TEZ_TOKEN_SYMBOL } from '../token/data/tokens-metadata';
import { DEFAULT_EVM_CURRENCY, EvmNativeTokenMetadata } from '../token/interfaces/token-metadata.interface';
import { ETHERLINK_MAINNET_CHAIN_ID, FALLBACK_EVM_RPCS_LIST, TEMPLE_RPC } from '../utils/rpc/rpc-list';

export interface EvmNetworkEssentials {
  rpcBaseURL: string;
  chainId: number;
}

export interface RpcBase {
  chain: TempleChainKind;
  id: string;
  rpcBaseURL: string;
  chainId: string | number;
  name: string;
  description?: string;
  /** Means: hardcoded, never stored */
  default?: boolean;
}

export interface TezosRpc extends RpcBase {
  chain: TempleChainKind.Tezos;
  chainId: string;
}

export interface EvmRpc extends RpcBase {
  chain: TempleChainKind.EVM;
  chainId: number;
}

interface BasicEvmChain {
  kind: TempleChainKind.EVM;
  chainId: number;
}

interface BasicTezosChain {
  kind: TempleChainKind.Tezos;
  chainId: string;
}

export interface BlockExplorer {
  name: string;
  url: string;
  id: string;
  default: boolean;
}

interface ChainSpecsBase {
  activeRpcId?: string;
  activeBlockExplorerId?: string;
  disabled?: boolean;
  disabledAutomatically?: boolean;
  name: string;
  default: boolean;
}

interface TezosChainSpecs extends ChainSpecsBase {
  currencySymbol?: string;
}

export interface EvmChainSpecs extends ChainSpecsBase {
  chainId: number;
  currency?: EvmNativeTokenMetadata;
}

interface ChainBase {
  activeBlockExplorer: BlockExplorer;
  name: string;
  disabled?: boolean;
  disabledAutomatically?: boolean;
  allBlockExplorers: BlockExplorer[];
  default: boolean;
}

export interface TezosChain extends BasicTezosChain, ChainBase {
  allRpcs: TezosRpc[];
  activeRpc: TezosRpc;
  currencySymbol?: string;
}

export interface EvmChain extends BasicEvmChain, ChainBase {
  currency: EvmNativeTokenMetadata;
  allRpcs: EvmRpc[];
  activeRpc: EvmRpc;
}

export const DEFAULT_TEZOS_RPCS: TezosRpc[] = [
  {
    id: 'tezos-default',
    name: 'Tezos',
    chain: TempleChainKind.Tezos,
    chainId: ChainIds.MAINNET,
    rpcBaseURL: TEMPLE_RPC.url,
    description: 'Default',
    default: true
  }
];

export const DEFAULT_TEZOS_BLOCK_EXPLORERS: BlockExplorer[] = [
  { name: 'TzKT', url: 'https://tzkt.io', id: 'tzkt-mainnet', default: true }
];

export const DEFAULT_MAINNET_TEZOS_CHAIN_SPECS: TezosChainSpecs = {
  name: 'Tezos',
  currencySymbol: TEZ_TOKEN_SYMBOL,
  activeRpcId: 'tezos-default',
  activeBlockExplorerId: 'tzkt-mainnet',
  default: true
};

export const DEFAULT_EVM_BLOCK_EXPLORERS: Record<number, BlockExplorer[]> = {
  [ETHERLINK_MAINNET_CHAIN_ID]: [
    { name: 'Etherlink explorer', url: 'https://explorer.etherlink.com', id: 'etherlink-mainnet', default: true }
  ]
};

export const DEFAULT_RPC_INDEX = 0;

export const DEFAULT_EVM_RPCS: Record<number, EvmRpc[]> = {
  [ETHERLINK_MAINNET_CHAIN_ID]: [
    {
      id: 'etherlink',
      name: 'Etherlink',
      chain: TempleChainKind.EVM,
      chainId: ETHERLINK_MAINNET_CHAIN_ID,
      rpcBaseURL: FALLBACK_EVM_RPCS_LIST[ETHERLINK_MAINNET_CHAIN_ID][DEFAULT_RPC_INDEX],
      description: 'Default RPC',
      default: true
    }
  ]
};

export const DEFAULT_EVM_CHAINS_SPECS: EvmChainSpecs[] = [
  {
    name: 'Etherlink',
    chainId: ETHERLINK_MAINNET_CHAIN_ID,
    currency: { ...DEFAULT_EVM_CURRENCY, name: 'Tezos', symbol: 'XTZ' },
    activeRpcId: 'etherlink',
    activeBlockExplorerId: 'etherlink-mainnet',
    default: true
  }
];

export type ChainOfKind<T extends TempleChainKind> = T extends TempleChainKind.Tezos ? TezosChain : EvmChain;

export type ChainId<T extends TempleChainKind = TempleChainKind> = ChainOfKind<T>['chainId'];
