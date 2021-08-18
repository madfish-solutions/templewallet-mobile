import AsyncStorage from '@react-native-async-storage/async-storage';
import { localForger } from '@taquito/local-forging';
import { TezosToolkit, MichelCodecPacker, CompositeForger, RpcForger } from '@taquito/taquito';
import { Tzip12Module } from '@taquito/tzip12';
import { Tzip16Module } from '@taquito/tzip16';
import { useEffect } from 'react';
import { BehaviorSubject } from 'rxjs';

import { RpcEnum } from '../../enums/network.enum';
import { getFastRpcClient } from './fast-rpc';
import { RPC } from './rpc-record';
import { currentRpcUrl$, updateCurrentRpc } from './rpc.utils';

export const CURRENT_NETWORK_ID = 'mainnet';
const michelEncoder = new MichelCodecPacker();

export const createTezosToolkit = (rpc: string) => {
  const tezosToolkit = new TezosToolkit(getFastRpcClient(rpc));
  tezosToolkit.setPackerProvider(michelEncoder);
  tezosToolkit.setForgerProvider(new CompositeForger([tezosToolkit.getFactory(RpcForger)(), localForger]));
  tezosToolkit.addExtension(new Tzip16Module());
  tezosToolkit.addExtension(new Tzip12Module());

  return tezosToolkit;
};

export const tezosToolkit$ = new BehaviorSubject(
  createTezosToolkit(RPC.filter(item => item.id === RpcEnum.TEMPLE_DEFAULT)[0].url)
);

export const useUpdateTezosToolkit = () =>
  useEffect(() => {
    const subscription = currentRpcUrl$.subscribe(rpc =>
      tezosToolkit$.getValue().setRpcProvider(getFastRpcClient(rpc))
    );
    AsyncStorage.getItem('nodeInstance').then(data =>
      updateCurrentRpc(RPC.filter(item => item.id === data ?? item.id === RpcEnum.TEMPLE_DEFAULT)[0])
    );

    return () => subscription.unsubscribe();
  }, []);
