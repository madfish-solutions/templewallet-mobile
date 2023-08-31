import { useMemo } from 'react';

import { selectFarmsSortValueAction } from 'src/store/farms/actions';
import {
  useFarmsLoadingSelector,
  useAllFarmsSelector,
  useFarmSortFieldSelector,
  useLastFarmsStakesSelector
} from 'src/store/farms/selectors';

import { useFilteredEarnOpportunities } from './use-filtered-earn-opportunities.hook';

export const useFilteredFarmings = () => {
  const farms = useAllFarmsSelector();
  const stakes = useLastFarmsStakesSelector();
  const sortField = useFarmSortFieldSelector();
  const farmsLoading = useFarmsLoadingSelector();
  const pageIsLoading = farmsLoading && farms.data.length === 0;
  const farmsItems = useMemo(() => farms.data.map(({ item }) => item), [farms.data]);

  const { depositedOnly, filteredItemsList, setSearchValue, handleSetSortField, handleToggleDepositOnly } =
    useFilteredEarnOpportunities(selectFarmsSortValueAction, sortField, farmsItems, stakes);

  return {
    sortField,
    depositedOnly,
    filteredItemsList,
    pageIsLoading,
    setSearchValue,
    handleSetSortField,
    handleToggleDepositOnly
  };
};
