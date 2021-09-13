import { RpcEnum } from '../../enums/rpc.enum';
import { RpcInterface } from '../../interfaces/rpc.interface';

export const RpcArray: RpcInterface[] = [
  {
    id: RpcEnum.TEMPLE_DEFAULT,
    name: 'tezosMainnet',
    label: 'Temple Default',
    description: 'Tezos mainnet',
    url: 'https://mainnet-node.madfish.solutions'
  },
  {
    id: RpcEnum.GIGANODE,
    label: 'Tezos Giga Node',
    name: 'tezosGigaNode',
    description: 'Tezos Giga Node',
    url: 'https://mainnet-tezos.giganode.io'
  },
  {
    id: RpcEnum.SMART_PY_NODE,
    label: 'SmartPy Node',
    name: 'smartPy',
    description: 'SmartPY node',
    url: 'https://mainnet.smartpy.io'
  },
  {
    id: RpcEnum.BLOCK_SCALE_NODE,
    label: 'TZ Beta Node',
    name: 'tzBetaNode',
    description: 'TZ Beta Node',
    url: 'https://rpc.tzbeta.net/'
  }
];
