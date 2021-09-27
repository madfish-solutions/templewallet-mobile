import { TezosToolkit } from '@taquito/taquito';
import { isTezosDomainsSupportedNetwork, DomainNameValidationResult, TezosDomainsValidator, TezosDomainsProxyContractAddressResolver } from '@tezos-domains/core';
import { TaquitoTezosDomainsClient } from '@tezos-domains/taquito-client';
import { validateAddress } from '@taquito/utils';

export const isTezosDomainsSupported = (tezos: TezosToolkit) =>
  isTezosDomainsSupportedNetwork('mainnet')
    ? new TaquitoTezosDomainsClient({ network: 'mainnet', tezos })
    : TaquitoTezosDomainsClient.Unsupported;

export const isTezosDomainNameValid = (domain: string) => {
  return new TezosDomainsValidator().validateDomainName(domain) === DomainNameValidationResult.VALID
}
