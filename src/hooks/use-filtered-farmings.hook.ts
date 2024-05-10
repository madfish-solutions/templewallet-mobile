import { selectFarmsSortValueAction } from 'src/store/farms/actions';
import {
  useAllFarmsWereLoadingSelector,
  useAllFarms,
  useFarmSortFieldSelector,
  useLastFarmsStakesSelector
} from 'src/store/farms/selectors';

import { useFilteredEarnOpportunities } from './use-filtered-earn-opportunities.hook';

export const useFilteredFarmings = () => {
  const farms = useAllFarms();
  const stakes = useLastFarmsStakesSelector();
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
