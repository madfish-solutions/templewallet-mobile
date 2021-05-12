import { NetworkInterface } from '../../interfaces/network.interface';

export const Mainnet: NetworkInterface = {
  id: 'mainnet',
  name: 'tezosMainnet',
  nameI18nKey: 'tezosMainnet',
  description: 'Tezos mainnet',
  lambdaContract: 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
  type: 'main',
  rpcBaseURL: 'https://mainnet-tezos.giganode.io',
  color: '#83b300',
  disabled: false
};
