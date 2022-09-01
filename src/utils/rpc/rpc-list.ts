import { RpcInterface } from '../../interfaces/rpc.interface';

export const DCP_RPC: RpcInterface = {
  name: 'T4L3NT Mainnet',
  url: 'https://rpc.decentralized.pictures'
};

export const TEMPLE_RPC: RpcInterface = {
  name: 'Temple Default',
  url: 'https://uoi3x99n7c.tezosrpc.midl.dev'
};

export const OLD_TEMPLE_RPC_URL = 'https://mainnet-node.madfish.solutions';

export const RpcList: RpcInterface[] = [
  TEMPLE_RPC,
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
