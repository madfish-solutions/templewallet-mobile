import { selectSavingsSortValueAction } from 'src/store/savings/actions';
import {
  useSavingsItems,
  useSavingsSortFieldSelector,
  useSavingsStakes,
  useAllSavingsItemsWereLoadingSelector
} from 'src/store/savings/selectors';

import { useFilteredEarnOpportunities } from './use-filtered-earn-opportunities.hook';

export const useFilteredSavings = () => {
  const savingsItems = useSavingsItems();
  const stakes = useSavingsStakes();
  const sortField = useSavingsSortFieldSelector();
  const allSavingsWereLoading = useAllSavingsItemsWereLoadingSelector();

  const { depositedOnly, filteredItemsList, setSearchValue, handleSetSortField, handleToggleDepositOnly } =
    useFilteredEarnOpportunities(selectSavingsSortValueAction, sortField, savingsItems, stakes);

  return {
    sortField,
    depositedOnly,
    filteredItemsList,
    shouldShowLoader: !allSavingsWereLoading,
    setSearchValue,
    handleSetSortField,
    handleToggleDepositOnly
  };
};
