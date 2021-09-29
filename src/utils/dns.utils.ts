import { TezosToolkit } from '@taquito/taquito';
import { DomainNameValidationResult, TezosDomainsValidator } from '@tezos-domains/core';
import { TaquitoTezosDomainsClient } from '@tezos-domains/taquito-client';

export const isTezosDomainsSupported = (tezos: TezosToolkit) =>
  new TaquitoTezosDomainsClient({ network: 'mainnet', tezos });

export const isTezosDomainNameValid = (domain: string) => {
  return new TezosDomainsValidator().validateDomainName(domain) === DomainNameValidationResult.VALID;
};
