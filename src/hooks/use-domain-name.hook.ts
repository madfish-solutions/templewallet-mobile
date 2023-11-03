import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ONE_MINUTE } from 'src/config/fixed-times';
import { EMPTY_PUBLIC_KEY_HASH } from 'src/config/system';
import { setIsDomainAddressShown } from 'src/store/settings/settings-actions';
import { tezosDomainsResolver } from 'src/utils/dns.utils';
import { isDefined } from 'src/utils/is-defined';

import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';

// minimal memoization implementation

type memType = { publicKeyHash: string; timestamp: string };

const MEM_TIMEOUT = 5 * ONE_MINUTE;

const domainMem: Record<string, memType> = {};

const isMemoized = (pkh: string) =>
  isDefined(domainMem[pkh]) && Date.now() - Number(domainMem[pkh].timestamp) < MEM_TIMEOUT;

export const useDomainName = (publicKeyHash: string) => {
  const [domainName, setDomainName] = useState(isMemoized(publicKeyHash) || '');
  const dispatch = useDispatch();
  const tezos = useReadOnlyTezosToolkit();
  const resolver = tezosDomainsResolver(tezos);

  const updateDomainReverseName = async (pkh: string) => {
    if (isMemoized(pkh)) {
      setDomainName(domainMem[pkh].publicKeyHash);

      return;
    }
    const resolvedName = (await resolver.resolveAddressToName(pkh)) ?? '';
    domainMem[pkh] = { publicKeyHash: resolvedName, timestamp: Date.now().toString() };
    setDomainName(resolvedName);
  };

  useEffect(() => {
    if (publicKeyHash !== EMPTY_PUBLIC_KEY_HASH) {
      updateDomainReverseName(publicKeyHash);
    } else {
      dispatch(setIsDomainAddressShown(false));
    }

    return undefined;
  }, [publicKeyHash]);

  return domainName;
};
