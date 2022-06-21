import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { EMPTY_PUBLIC_KEY_HASH } from '../config/system';
import { useSelectedAccountSelector } from '../store/wallet/wallet-selectors';
import { tezosDomainsResolver } from '../utils/dns.utils';
import { isDefined } from '../utils/is-defined';
import { useReadOnlyTezosToolkit } from './use-read-only-tezos-toolkit.hook';
import { setIsDomainAddressShown } from '../store/settings/settings-actions';

// minimal memoization implementation

type memType = { publicKeyHash: string; timestamp: string };

const MEM_TIMEOUT = 1000 * 60 * 5;

const domainMem: Record<string, memType> = {};

const isMemoized = (pkh: string) =>
  isDefined(domainMem[pkh]) && Date.now() - Number(domainMem[pkh].timestamp) < MEM_TIMEOUT;

export const useDomainName = (publicKeyHash: string) => {
  const [domainName, setDomainName] = useState(isMemoized(publicKeyHash) || '');
  const dispatch = useDispatch();
  const selectedAccount = useSelectedAccountSelector();
  const tezos = useReadOnlyTezosToolkit(selectedAccount);
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
