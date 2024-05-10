import { selectSavingsSortValueAction } from 'src/store/savings/actions';
import {
  useSavingsItems,
  useSavingsSortFieldSelector,
  useSavingsStakesSelector,
  useSomeSavingsItemsWereLoadingSelector
} from 'src/store/savings/selectors';

import { useFilteredEarnOpportunities } from './use-filtered-earn-opportunities.hook';

export const useFilteredSavings = () => {
  const savingsItems = useSavingsItems();
  const stakes = useSavingsStakesSelector();
  const sortField = useSavingsSortFieldSelector();
  const someSavingsWereLoading = useSomeSavingsItemsWereLoadingSelector();

  const { depositedOnly, filteredItemsList, setSearchValue, handleSetSortField, handleToggleDepositOnly } =
    useFilteredEarnOpportunities(selectSavingsSortValueAction, sortField, savingsItems, stakes);

  return {
    sortField,
    depositedOnly,
    filteredItemsList,
    shouldShowLoader: !someSavingsWereLoading,
    setSearchValue,
    handleSetSortField,
    handleToggleDepositOnly
  };
};
