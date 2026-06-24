import { localForger } from '@taquito/local-forging';
import { CompositeForger, MichelCodecPacker, RpcForger, TezosToolkit } from '@taquito/taquito';
import { Tzip12Module } from '@taquito/tzip12';
import {
  Handler,
  HttpHandler,
  IpfsHttpHandler,
  MetadataProvider,
  TezosStorageHandler,
  Tzip16Module
} from '@taquito/tzip16';
import memoize from 'memoizee';

import { TezosReadOnlySignerPayload } from 'src/types/tezos-read-only-signer-payload';
import { TezosReadOnlySigner } from 'src/utils/tezos-read-only.signer.util';

import { isDefined } from '../is-defined';

import { getFallbackRpcClient } from './fallback-rpc';

const michelEncoder = new MichelCodecPacker();

export const createTezosToolkit = (preferredRpcUrl?: string) => {
  const metadataProvider = new MetadataProvider(
    new Map<string, Handler>([
      ['http', new HttpHandler()],
      ['https', new HttpHandler()],
      ['tezos-storage', new TezosStorageHandler()],
      ['ipfs', new IpfsHttpHandler('ipfs.filebase.io')]
    ])
  );
  const tezosToolkit = new TezosToolkit(getFallbackRpcClient(preferredRpcUrl));
  tezosToolkit.setPackerProvider(michelEncoder);
  tezosToolkit.setForgerProvider(new CompositeForger([tezosToolkit.getFactory(RpcForger)(), localForger]));
  tezosToolkit.addExtension(new Tzip16Module(metadataProvider));
  tezosToolkit.addExtension(new Tzip12Module(metadataProvider));

  return tezosToolkit;
};

export const createReadOnlyTezosToolkit = memoize(
  (sender?: TezosReadOnlySignerPayload | null, preferredRpcUrl?: string) => {
    const readOnlyTezosToolkit = createTezosToolkit(preferredRpcUrl);
    if (isDefined(sender)) {
      readOnlyTezosToolkit.setSignerProvider(new TezosReadOnlySigner(sender.address, sender.publicKey));
    }

    return readOnlyTezosToolkit;
  },
  { normalizer: ([sender]) => sender?.address ?? '', max: 10 }
);
