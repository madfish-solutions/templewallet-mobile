import { RpcInterface } from 'src/interfaces/rpc.interface';

export const DCP_RPC: RpcInterface = {
  name: 'T4L3NT Mainnet',
  url: 'https://rpc.decentralized.pictures'
};

export const TEMPLE_RPC: RpcInterface = {
  name: 'Tezos Mainnet',
  url: 'https://prod.tcinfra.net/rpc/mainnet'
};

export const MARIGOLD_RPC: RpcInterface = {
  name: 'Marigold Mainnet',
  url: 'https://mainnet.tezos.marigold.dev'
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

export const FALLBACK_RPC_LIST = [
  'https://mainnet.smartpy.io',
  'https://mainnet.api.tez.ie',
  'https://rpc.tzkt.io/mainnet',
  'https://rpc.tzbeta.net',
  'https://mainnet.tezos.ecadinfra.com'
];
