import { useMemo } from 'react';

import { selectFarmsSortValueAction } from 'src/store/farms/actions';
import {
  useFarmsWereLoadingSelector,
  useAllFarms,
  useFarmSortFieldSelector,
  useLastFarmsStakesSelector
} from 'src/store/farms/selectors';

import { useFilteredEarnOpportunities } from './use-filtered-earn-opportunities.hook';

export const useFilteredFarmings = () => {
  const farms = useAllFarms();
  const stakes = useLastFarmsStakesSelector();
  const sortField = useFarmSortFieldSelector();
  const farmsWereLoading = useFarmsWereLoadingSelector();
  const farmsItems = useMemo(() => farms.data.map(({ item }) => item), [farms.data]);

  const { depositedOnly, filteredItemsList, setSearchValue, handleSetSortField, handleToggleDepositOnly } =
    useFilteredEarnOpportunities(selectFarmsSortValueAction, sortField, farmsItems, stakes);

  return {
    sortField,
    depositedOnly,
    filteredItemsList,
    shouldShowLoader: !farmsWereLoading,
    setSearchValue,
    handleSetSortField,
    handleToggleDepositOnly
  };
};
