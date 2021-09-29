import { TezosToolkit } from '@taquito/taquito';
import { DomainNameValidationResult, TezosDomainsValidator } from '@tezos-domains/core';
import { TaquitoTezosDomainsClient } from '@tezos-domains/taquito-client';

export const tezosDomainsResolver = (tezos: TezosToolkit) =>
  new TaquitoTezosDomainsClient({ network: 'mainnet', tezos }).resolver;

export const isTezosDomainNameValid = (domain: string) =>
  new TezosDomainsValidator().validateDomainName(domain) === DomainNameValidationResult.VALID;
