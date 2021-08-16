import { NetworkEnum } from '../../enums/network.enum';
import { NetworkRecord } from '../../interfaces/network.interface';

export const NETWORKS: NetworkRecord = {
  [NetworkEnum.TEMPLE_DEFAULT]: {
    id: NetworkEnum.TEMPLE_DEFAULT,
    name: 'tezosMainnet',
    label: 'Temple Default',
    description: 'Tezos mainnet',
    lambdaContract: 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
    rpcBaseURL: 'https://mainnet-node.madfish.solutions'
  },
  [NetworkEnum.GIGANODE]: {
    id: NetworkEnum.GIGANODE,
    label: 'Tezos Giga Node',
    name: 'tezosGigaNode',
    description: 'Tezos Giga Node',
    lambdaContract: 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
    rpcBaseURL: 'https://mainnet-tezos.giganode.io'
  },
  [NetworkEnum.SMART_PY_NODE]: {
    id: NetworkEnum.SMART_PY_NODE,
    label: 'SmartPy Node',
    name: 'smartPy',
    description: 'SmartPY node',
    lambdaContract: 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
    rpcBaseURL: 'https://mainnet.smartpy.io/'
  },
  [NetworkEnum.BLOCK_SCALE_NODE]: {
    id: NetworkEnum.BLOCK_SCALE_NODE,
    label: 'BlockScale Node',
    name: 'Blockscale',
    description: 'Blockscale node',
    lambdaContract: 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
    rpcBaseURL: 'https://rpc.tzbeta.net/'
  }
};
