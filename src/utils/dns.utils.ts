import { DomainNameValidationResult, TezosDomainsValidator } from '@tezos-domains/core';
import { TaquitoTezosDomainsClient } from '@tezos-domains/taquito-client';
import memoizee from 'memoizee';

import { createReadOnlyTezosToolkit } from './rpc/tezos-toolkit.utils';

export const tezosDomainsResolver = memoizee(
  (preferredRpcUrl?: string) =>
    new TaquitoTezosDomainsClient({ network: 'mainnet', tezos: createReadOnlyTezosToolkit(undefined, preferredRpcUrl) })
      .resolver
);

export const isTezosDomainNameValid = (domain: string) =>
  new TezosDomainsValidator().validateDomainName(domain, { minLevel: 2 }) === DomainNameValidationResult.VALID;
