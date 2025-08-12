import { useMemo } from 'react';

import { UserStakeValueInterface } from 'src/interfaces/user-stake-value.interface';
import { nullableEntityWasLoading } from 'src/utils/earn-opportunities/store.utils';
import { isDefined } from 'src/utils/is-defined';

import { useSelector } from '../selector';

export const useAllSavingsItemsWereLoadingSelector = () =>
  useSelector(({ savings }) =>
    Object.values(savings.allSavingsItems).every(({ data, error }) => data.length > 0 || isDefined(error))
  );

export const useSavingsItem = (id: string, contractAddress: string) => {
  const allSavings = useSelector(({ savings }) => savings.allSavingsItems);

  return useMemo(
    () =>
      Object.values(allSavings)
        .map(({ data }) => data)
        .flat()
        .find(item => item.id === id && item.contractAddress === contractAddress),
    [allSavings, id, contractAddress]
  );
};

export const useSavingsItemsLoadingSelector = () =>
  useSelector(({ savings }) => Object.values(savings.allSavingsItems).some(({ isLoading }) => isLoading));

export const useSavingsErrorSelector = (): string | undefined =>
  useSelector(({ savings }) => {
    const errors = Object.values(savings.allSavingsItems)
      .map(({ error }) => error)
      .filter((e): e is string => isDefined(e));

    return errors[0];
  });

export const useSavingsItemStakeSelector = (itemAddress: string): UserStakeValueInterface | undefined =>
  useSelector(
    ({ savings, wallet }) => savings.stakes[wallet.selectedAccountPublicKeyHash]?.[itemAddress]?.data ?? undefined
  );

export const useSavingsItems = () => {
  const allSavingsItemsStates = useSelector(({ savings }) => savings.allSavingsItems);

  return useMemo(
    () =>
      Object.values(allSavingsItemsStates)
        .map(({ data }) => data)
        .flat(),
    [allSavingsItemsStates]
  );
};

export const useSavingsStakes = () => {
  const rawStakes = useSelector(({ savings, wallet }) => savings.stakes[wallet.selectedAccountPublicKeyHash]);

  return useMemo(
    () => Object.fromEntries(Object.entries(rawStakes ?? {}).map(([key, { data }]) => [key, data ?? undefined])),
    [rawStakes]
  );
};

export const useSavingsSortFieldSelector = () => useSelector(({ savings }) => savings.sortField);

export const useSavingsStakesLoadingSelector = () =>
  useSelector(({ savings, wallet }) => {
    const accountStakes = savings.stakes[wallet.selectedAccountPublicKeyHash] ?? {};

    return Object.values(accountStakes).some(({ isLoading }) => isLoading);
  });

export const useSomeSavingsStakesWereLoadingSelector = () =>
  useSelector(({ savings, wallet }) => {
    const accountStakes = savings.stakes[wallet.selectedAccountPublicKeyHash] ?? {};

    return Object.values(accountStakes).some(nullableEntityWasLoading);
  });

export const useSavingsItemStakeWasLoadingSelector = (itemAddress: string) =>
  useSelector(({ savings, wallet }) =>
    nullableEntityWasLoading(savings.stakes[wallet.selectedAccountPublicKeyHash]?.[itemAddress])
  );
