import { selectSavingsSortValueAction } from 'src/store/savings/actions';
import {
  useSavingsItemsLoadingSelector,
  useSavingsItemsSelector,
  useSavingsSortFieldSelector,
  useSavingsStakesSelector
} from 'src/store/savings/selectors';

import { useFilteredEarnOpportunities } from './use-filtered-earn-opportunities.hook';

export const useFilteredSavings = () => {
  const savingsItems = useSavingsItemsSelector();
  const stakes = useSavingsStakesSelector();
  const sortField = useSavingsSortFieldSelector();
  const savingsItemsLoading = useSavingsItemsLoadingSelector();
  const pageIsLoading = savingsItemsLoading && savingsItems.length === 0;

  const { depositedOnly, filteredItemsList, setSearchValue, handleSetSortField, handleToggleDepositOnly } =
    useFilteredEarnOpportunities(selectSavingsSortValueAction, sortField, savingsItems, stakes);

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
