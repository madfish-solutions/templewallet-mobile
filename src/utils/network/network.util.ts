import { TezosToolkit } from '@taquito/taquito';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { MAINNET_NETWORK } from './networks';

export const createTezosToolkit = (rpc: string) => new TezosToolkit(rpc);

const currentNetwork$ = new BehaviorSubject(MAINNET_NETWORK);
export const currentNetworkId$ = currentNetwork$.pipe(map(({ id }) => id));
export const currentNetworkRpc$ = currentNetwork$.pipe(map(({ rpcBaseURL }) => rpcBaseURL));
export const tezos$ = new BehaviorSubject(createTezosToolkit(MAINNET_NETWORK.rpcBaseURL));
