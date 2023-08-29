import { useMemo } from 'react';

import { useSelector } from '../selector';

export const useSavingsItemSelector = (id: string, contractAddress: string) => {
  const list = useSelector(({ savings }) => savings.allSavingsItems.data);

  return useMemo(
    () => list.find(item => item.id === id && item.contractAddress === contractAddress),
    [list, id, contractAddress]
  );
};

export const useSavingsItemStakeSelector = (farmAddress: string) =>
  useSelector(({ savings }) => savings.stakes.data[farmAddress]);

export const useSavingsItemsLoadingSelector = () => useSelector(({ savings }) => savings.allSavingsItems.isLoading);

export const useSavingsItemsSelector = () => useSelector(({ savings }) => savings.allSavingsItems.data);

export const useSavingsStakesSelector = () => useSelector(({ savings }) => savings.stakes.data);

export const useSavingsSortFieldSelector = () => useSelector(({ savings }) => savings.sortField);
