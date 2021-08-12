import { NetworkInterface } from '../../interfaces/network.interface';

export const MAINNET_NETWORK: NetworkInterface = {
  id: 'mainnet',
  name: 'tezosMainnet',
  nameI18nKey: 'tezosMainnet',
  description: 'Tezos mainnet',
  lambdaContract: 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
  type: 'main',
  rpcBaseURL: 'https://mainnet-node.madfish.solutions',
  color: '#83b300',
  disabled: false
};
