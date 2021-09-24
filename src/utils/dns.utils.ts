import { TezosToolkit } from '@taquito/taquito';
import { isTezosDomainsSupportedNetwork } from '@tezos-domains/core';
import { TaquitoTezosDomainsClient } from '@tezos-domains/taquito-client';

export const isTezosDomainsSupported = (tezos: TezosToolkit) =>
  isTezosDomainsSupportedNetwork('mainnet')
    ? new TaquitoTezosDomainsClient({ network: 'mainnet', tezos })
    : TaquitoTezosDomainsClient.Unsupported;
