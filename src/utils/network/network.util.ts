import { TezosToolkit, MichelCodecPacker, CompositeForger, RpcForger } from '@taquito/taquito';
import { localForger } from '@taquito/local-forging';
import memoize from 'mem';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { MAINNET_NETWORK } from './networks';
import { FastRpcClient } from './fast-rpc';

const michelEncoder = new MichelCodecPacker();

export const createTezosToolkit = (rpc: string) => {
  const tezos = new TezosToolkit(getFastRpcClient(rpc));
  tezos.setPackerProvider(michelEncoder);
  tezos.setForgerProvider(new CompositeForger([tezos.getFactory(RpcForger)(), localForger]));
  return tezos;
};

export const getFastRpcClient = memoize((rpc: string) => new FastRpcClient(rpc));

const currentNetwork$ = new BehaviorSubject(MAINNET_NETWORK);
export const currentNetworkId$ = currentNetwork$.pipe(map(({ id }) => id));
export const currentNetworkRpc$ = currentNetwork$.pipe(map(({ rpcBaseURL }) => rpcBaseURL));
export const tezos$ = new BehaviorSubject(createTezosToolkit(MAINNET_NETWORK.rpcBaseURL));
