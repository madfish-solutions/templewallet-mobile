import { localForger } from '@taquito/local-forging';
import { CompositeForger, MichelCodecPacker, RpcForger, TezosToolkit } from '@taquito/taquito';
import { Tzip12Module } from '@taquito/tzip12';
import { Tzip16Module } from '@taquito/tzip16';
import memoize from 'memoizee';

import { ReadOnlySignerPayload } from 'src/types/read-only-signer-payload';
import { ReadOnlySigner } from 'src/utils/read-only.signer.util';

import { isDefined } from '../is-defined';

import { getFallbackRpcClient } from './fallback-rpc';

const michelEncoder = new MichelCodecPacker();

export const createTezosToolkit = (rpcUrl: string) => {
  const tezosToolkit = new TezosToolkit(getFallbackRpcClient(rpcUrl));
  tezosToolkit.setPackerProvider(michelEncoder);
  tezosToolkit.setForgerProvider(new CompositeForger([tezosToolkit.getFactory(RpcForger)(), localForger]));
  tezosToolkit.addExtension(new Tzip16Module());
  tezosToolkit.addExtension(new Tzip12Module());

  return tezosToolkit;
};

export const createReadOnlyTezosToolkit = memoize(
  (rpcUrl: string, sender?: ReadOnlySignerPayload) => {
    const readOnlyTezosToolkit = createTezosToolkit(rpcUrl);
    if (isDefined(sender)) {
      readOnlyTezosToolkit.setSignerProvider(new ReadOnlySigner(sender.publicKeyHash, sender.publicKey));
    }

    return readOnlyTezosToolkit;
  },
  { normalizer: ([rpcUrl, sender]) => `${rpcUrl}_${sender?.publicKeyHash}`, max: 10 }
);
