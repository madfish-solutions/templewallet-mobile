import { jsonEqualityFn } from 'src/utils/store.utils';

import { useSelector } from '../selector';
import { useSelectedAccountSelector } from '../wallet/wallet-selectors';

import { Collection } from './collections-state';

const useCollectionsSelector = () => useSelector(state => state.collections.created, jsonEqualityFn);

export const useCreatedCollectionsSelector = (): Collection[] => {
  const selectedAccount = useSelectedAccountSelector();
  const createdCollections = useCollectionsSelector();

  return createdCollections[selectedAccount.publicKeyHash] ?? [];
};
