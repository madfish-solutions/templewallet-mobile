import { useMemo } from 'react';

import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';

import { useSelector } from '../selector';

export const useSavingsItemSelector = (id: string, contractAddress: string) => {
  const list = useSelector(({ savings }) => savings.allSavingsItems.data);

  return useMemo(
    () => list.find(item => item.id === id && item.contractAddress === contractAddress),
    [list, id, contractAddress]
  );
};

export const useSavingsItemStakeSelector = (itemAddress: string): UserStakeValueInterface | undefined =>
  useSelector(({ savings, wallet }) => savings.stakes[wallet.selectedAccountPublicKeyHash]?.[itemAddress]?.data);

export const useSavingsItemsLoadingSelector = () => useSelector(({ savings }) => savings.allSavingsItems.isLoading);

export const useSavingsItemsSelector = () => useSelector(({ savings }) => savings.allSavingsItems.data);

export const useSavingsStakesSelector = () =>
  useSelector(({ savings, wallet }) => {
    const rawStakes = savings.stakes[wallet.selectedAccountPublicKeyHash] ?? {};

    return Object.fromEntries(Object.entries(rawStakes).map(([key, { data }]) => [key, data]));
  });

export const useSavingsSortFieldSelector = () => useSelector(({ savings }) => savings.sortField);

export const useSavingsStakesLoadingSelector = () =>
  useSelector(({ savings, wallet }) => {
    const accountStakes = savings.stakes[wallet.selectedAccountPublicKeyHash] ?? {};

    return Object.values(accountStakes).some(({ isLoading }) => isLoading);
  });

export const useSavingsStakesWereLoadingSelector = () =>
  useSelector(({ savings, wallet }) => {
    const accountStakes = savings.stakes[wallet.selectedAccountPublicKeyHash] ?? {};

    return Object.values(accountStakes).some(({ wasLoading }) => wasLoading);
  });

export const useSavingsItemStakeWasLoadingSelector = (itemAddress: string) => {
  const stake = useSelector(
    ({ savings, wallet }) => savings.stakes[wallet.selectedAccountPublicKeyHash]?.[itemAddress]
  );

  return stake?.wasLoading ?? false;
};
