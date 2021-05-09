import { NetworkInterface } from '../../interfaces/network.interface';

export const networks: NetworkInterface[] = [
  {
    id: 'mainnet',
    name: 'tezosMainnet',
    nameI18nKey: 'tezosMainnet',
    description: 'Tezos mainnet',
    lambdaContract: 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
    type: 'main',
    rpcBaseURL: 'https://mainnet-tezos.giganode.io',
    color: '#83b300',
    disabled: false
  },
  {
    id: 'florencenet',
    name: 'Florence Testnet',
    description: 'Florence testnet',
    lambdaContract: 'KT1BbTmNHmJp2NnQyw5qsAExEYmYuUpR2HdX',
    type: 'test',
    rpcBaseURL: 'https://florencenet.smartpy.io',
    color: '#FFD88A',
    disabled: false
  }
];
