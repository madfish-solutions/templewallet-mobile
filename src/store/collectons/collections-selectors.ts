import { useMemo } from 'react';

import { useSelector } from '../selector';
import { useAccountAddressForTezos } from '../wallet/wallet-selectors';

import { Collection } from './collections-state';

export const useCreatedCollectionsSelector = (): Collection[] => {
  const accountPKH = useAccountAddressForTezos();
  const createdCollections = useSelector(state => state.collections.created);

  return useMemo(() => (accountPKH ? createdCollections[accountPKH] ?? [] : []), [createdCollections, accountPKH]);
};
