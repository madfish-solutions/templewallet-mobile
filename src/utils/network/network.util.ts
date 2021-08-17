import { localForger } from '@taquito/local-forging';
import { TezosToolkit, MichelCodecPacker, CompositeForger, RpcForger } from '@taquito/taquito';
import { Tzip12Module } from '@taquito/tzip12';
import { Tzip16Module } from '@taquito/tzip16';
import memoize from 'mem';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import { RpcInterface } from '../../interfaces/network.interface';
import { FastRpcClient } from './fast-rpc';
import { RPC } from './networks';

const michelEncoder = new MichelCodecPacker();

export const createTezosToolkit = (rpc: string) => {
  const tezos = new TezosToolkit(getFastRpcClient(rpc));
  tezos.setPackerProvider(michelEncoder);
  tezos.setForgerProvider(new CompositeForger([tezos.getFactory(RpcForger)(), localForger]));
  tezos.addExtension(new Tzip16Module());
  tezos.addExtension(new Tzip12Module());

  return tezos;
};

export const getFastRpcClient = memoize((rpc: string) => new FastRpcClient(rpc));

export const currentNetwork$ = new BehaviorSubject(RPC.TEMPLE_DEFAULT);
export const currentNetworkId$ = currentNetwork$.pipe(map(({ id }) => id));
export const currentNetworkRpc$ = currentNetwork$.pipe(map(({ rpcBaseURL }) => rpcBaseURL));
export const tezos$ = currentNetworkRpc$.pipe(map(rpcBaseUrl => createTezosToolkit(rpcBaseUrl)));

export const updateCurrentNetwork = (rpc: RpcInterface) => currentNetwork$.next(rpc);
