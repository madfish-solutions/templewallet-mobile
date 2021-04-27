import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

export type EmptyFn = () => void;
export const emptyFn = () => void 0;

interface NetworkInterface {
  id: string;
  rpcBaseURL: string;
}

const networks: NetworkInterface[] = [
  {
    id: 'florencenet',
    name: 'Florence Testnet',
    description: 'Florence testnet',
    lambdaContract: 'KT1BbTmNHmJp2NnQyw5qsAExEYmYuUpR2HdX',
    type: 'test',
    rpcBaseURL: 'https://florencenet.smartpy.io',
    color: '#FFD88A',
    disabled: false
  },
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
  }
];

const currentNetwork$ = new BehaviorSubject(networks[0]);
export const currentNetworkId$ = currentNetwork$.pipe(map(({ id }) => id));
export const currentNetworkRpc$ = currentNetwork$.pipe(map(({ rpcBaseURL }) => rpcBaseURL));
