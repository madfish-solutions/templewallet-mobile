import { RpcInterface } from '../../interfaces/rpc.interface';

export const DCP_RPC: RpcInterface = {
  name: 'T4L3NT Mainnet',
  url: 'https://rpc.decentralized.pictures'
};

export const RpcList: RpcInterface[] = [
  {
    name: 'Temple Default',
    url: 'https://mainnet-node.madfish.solutions'
  },
  {
    name: 'Tezos Giga Node',
    url: 'https://mainnet-tezos.giganode.io'
  },
  {
    name: 'SmartPy Node',
    url: 'https://mainnet.smartpy.io'
  },
  DCP_RPC
];
