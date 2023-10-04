import { RpcInterface } from '../../interfaces/rpc.interface';

export const DCP_RPC: RpcInterface = {
  name: 'T4L3NT Mainnet',
  url: 'https://rpc.decentralized.pictures'
};

export const TEMPLE_RPC: RpcInterface = {
  name: 'Tezos Mainnet',
  url: 'https://prod.tcinfra.net/rpc/mainnet'
};

export const OLD_TEMPLE_RPC_URLS = ['https://mainnet-node.madfish.solutions', 'https://uoi3x99n7c.tezosrpc.midl.dev'];

export const RpcList: RpcInterface[] = [
  TEMPLE_RPC,
  {
    name: 'SmartPy Mainnet',
    url: 'https://mainnet.smartpy.io'
  },
  {
    name: 'ECAD Labs Mainnet',
    url: 'https://mainnet.api.tez.ie'
  },
  DCP_RPC
];
