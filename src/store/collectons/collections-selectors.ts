import { jsonEqualityFn } from 'src/utils/store.utils';

import { useSelector } from '../selector';
import { useSelectedAccountSelector } from '../wallet/wallet-selectors';

export const useCollectionsSelector = () => useSelector(state => state.collections.created, jsonEqualityFn);

export const useCreatedCollectionsSelector = () => {
  const selectedAccount = useSelectedAccountSelector();
  const createdCollections = useCollectionsSelector();

  return createdCollections[selectedAccount.publicKeyHash] ?? [];
};
