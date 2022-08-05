import { RpcTypeEnum } from '../../enums/rpc-type.enum';
import { RpcInterface } from '../../interfaces/rpc.interface';

export const RpcList: RpcInterface[] = [
  {
    name: 'Temple Default',
    url: 'https://mainnet-node.madfish.solutions',
    type: RpcTypeEnum.MAIN
  },
  {
    name: 'Tezos Giga Node',
    url: 'https://mainnet-tezos.giganode.io',
    type: RpcTypeEnum.MAIN
  },
  {
    name: 'SmartPy Node',
    url: 'https://mainnet.smartpy.io',
    type: RpcTypeEnum.MAIN
  },
  {
    name: 'TZ Beta Node',
    url: 'https://rpc.tzbeta.net',
    type: RpcTypeEnum.MAIN
  },
  {
    name: 'T4L3NT Mainnet',
    url: 'https://rpc.decentralized.pictures',
    type: RpcTypeEnum.DCP
  }
];
