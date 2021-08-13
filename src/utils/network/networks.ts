import { NetworkEnum } from '../../enums/network.enum';
import { NetworkRecord } from '../../interfaces/network.interface';

export const NETWORKS: NetworkRecord = {
  [NetworkEnum.TEMPLE_DEFAULT]: {
    id: NetworkEnum.TEMPLE_DEFAULT,
    label: 'Temple Default',
    name: 'tezosMainnet',
    nameI18nKey: 'tezosMainnet',
    description: 'Tezos mainnet',
    lambdaContract: 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
    type: 'main',
    rpcBaseURL: 'https://mainnet-tezos.giganode.io',
    color: '#83b300',
    disabled: false
  },
  [NetworkEnum.SMART_PY_NODE]: {
    id: NetworkEnum.SMART_PY_NODE,
    label: 'SmartPy Node',
    name: 'smartPy',
    nameI18nKey: 'smartPy',
    description: 'SmartPY node',
    lambdaContract: 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
    type: 'main',
    rpcBaseURL: 'https://mainnet.smartpy.io/',
    color: '#83b300',
    disabled: false
  },
  [NetworkEnum.BLOCK_SCALE_NODE]: {
    id: NetworkEnum.BLOCK_SCALE_NODE,
    label: 'BlockScale Node',
    name: 'Blockscale',
    nameI18nKey: 'Blockscale',
    description: 'Blockscale node',
    lambdaContract: 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
    type: 'main',
    rpcBaseURL: 'https://rpc.tzbeta.net/',
    color: '#83b300',
    disabled: false
  }
};
