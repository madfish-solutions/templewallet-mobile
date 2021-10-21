import { localForger } from '@taquito/local-forging';
import { TezosToolkit, MichelCodecPacker, CompositeForger, RpcForger } from '@taquito/taquito';
import { Tzip12Module } from '@taquito/tzip12';
import { Tzip16Module } from '@taquito/tzip16';
import memoize from 'mem';

import { AccountInterface } from '../../interfaces/account.interface';
import { ReadOnlySigner } from '../read-only.signer.util';
// import { getFastRpcClient } from './fast-rpc';
import { currentRpc$ } from './rpc.utils';

export const CURRENT_NETWORK_ID = 'mainnet';
const michelEncoder = new MichelCodecPacker();

export const createTezosToolkit = (rpcUrl = currentRpc$.getValue().url) => {
  const tezosToolkit = new TezosToolkit(rpcUrl);
  tezosToolkit.setPackerProvider(michelEncoder);
  tezosToolkit.setForgerProvider(new CompositeForger([tezosToolkit.getFactory(RpcForger)(), localForger]));
  tezosToolkit.addExtension(new Tzip16Module());
  tezosToolkit.addExtension(new Tzip12Module());

  return tezosToolkit;
};

export const createReadOnlyTezosToolkit = (sender: AccountInterface) =>
  createReadOnlyTezosToolkitPure(currentRpc$.getValue().url, sender);

const createReadOnlyTezosToolkitPure = memoize(
  (rpcUrl: string, sender: AccountInterface) => {
    const readOnlyTezosToolkit = createTezosToolkit(rpcUrl);
    readOnlyTezosToolkit.setSignerProvider(new ReadOnlySigner(sender.publicKeyHash, sender.publicKey));

    return readOnlyTezosToolkit;
  },
  { cacheKey: ([rpcUrl, sender]) => `${rpcUrl}_${sender.publicKeyHash}` }
);
