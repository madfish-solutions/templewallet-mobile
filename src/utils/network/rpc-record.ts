import { RpcEnum } from '../../enums/network.enum';
import { RpcInterface } from '../../interfaces/network.interface';

export const RPC: Record<RpcEnum, RpcInterface> = {
  [RpcEnum.TEMPLE_DEFAULT]: {
    id: RpcEnum.TEMPLE_DEFAULT,
    name: 'tezosMainnet',
    label: 'Temple Default',
    description: 'Tezos mainnet',
    url: 'https://mainnet-node.madfish.solutions'
  },
  [RpcEnum.GIGANODE]: {
    id: RpcEnum.GIGANODE,
    label: 'Tezos Giga Node',
    name: 'tezosGigaNode',
    description: 'Tezos Giga Node',
    url: 'https://mainnet-tezos.giganode.io'
  },
  [RpcEnum.SMART_PY_NODE]: {
    id: RpcEnum.SMART_PY_NODE,
    label: 'SmartPy Node',
    name: 'smartPy',
    description: 'SmartPY node',
    url: 'https://mainnet.smartpy.io'
  },
  [RpcEnum.BLOCK_SCALE_NODE]: {
    id: RpcEnum.BLOCK_SCALE_NODE,
    label: 'BlockScale Node',
    name: 'Blockscale',
    description: 'Blockscale node',
    url: 'https://rpc.tzbeta.net/'
  }
};
