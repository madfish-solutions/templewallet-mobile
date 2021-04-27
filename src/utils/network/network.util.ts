import { TezosToolkit } from '@taquito/taquito';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { networks } from './networks';

const currentNetwork$ = new BehaviorSubject(networks[0]);
export const currentNetworkId$ = currentNetwork$.pipe(map(({ id }) => id));
export const currentNetworkRpc$ = currentNetwork$.pipe(map(({ rpcBaseURL }) => rpcBaseURL));
export const tezos$ = currentNetworkRpc$.pipe(map(currentNetworkRpc => new TezosToolkit(currentNetworkRpc)));
