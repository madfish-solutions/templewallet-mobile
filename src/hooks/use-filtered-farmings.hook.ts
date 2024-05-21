import { selectFarmsSortValueAction } from 'src/store/farms/actions';
import {
  useAllFarmsWereLoadingSelector,
  useAllFarms,
  useFarmSortFieldSelector,
  useLastFarmsStakes
} from 'src/store/farms/selectors';

import { useFilteredEarnOpportunities } from './use-filtered-earn-opportunities.hook';

export const useFilteredFarmings = () => {
  const farms = useAllFarms();
  const stakes = useLastFarmsStakes();
  const sortField = useFarmSortFieldSelector();
  const allFarmsWereLoading = useAllFarmsWereLoadingSelector();

  const { depositedOnly, filteredItemsList, setSearchValue, handleSetSortField, handleToggleDepositOnly } =
    useFilteredEarnOpportunities(selectFarmsSortValueAction, sortField, farms, stakes);

  return {
    sortField,
    depositedOnly,
    filteredItemsList,
    shouldShowLoader: !allFarmsWereLoading,
    setSearchValue,
    handleSetSortField,
    handleToggleDepositOnly
  };
};
