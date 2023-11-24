import { useMemo } from 'react';

import { useSelector } from '../selector';
import { useCurrentAccountPkhSelector } from '../wallet/wallet-selectors';

import { Collection } from './collections-state';

export const useCreatedCollectionsSelector = (): Collection[] => {
  const accountPKH = useCurrentAccountPkhSelector();
  const createdCollections = useSelector(state => state.collections.created);

  return useMemo(() => createdCollections[accountPKH] ?? [], [createdCollections, accountPKH]);
};
