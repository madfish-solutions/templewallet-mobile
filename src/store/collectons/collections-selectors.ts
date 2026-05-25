import { useMemo } from 'react';

import { useSelector } from '../selector';
import { useCurrentAccountTezosAddressSelector } from '../wallet/wallet-selectors';

import { Collection } from './collections-state';

export const useCreatedCollectionsSelector = (): Collection[] => {
  const accountPKH = useCurrentAccountTezosAddressSelector();
  const createdCollections = useSelector(state => state.collections.created);

  return useMemo(() => (accountPKH ? createdCollections[accountPKH] ?? [] : []), [createdCollections, accountPKH]);
};
