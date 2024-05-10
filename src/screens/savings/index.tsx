import React, { FC, useMemo } from 'react';
import { ActivityIndicator, ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { EarnOpportunitySearchPanel } from 'src/components/earn-opportunity-search-panel';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { useFilteredSavings } from 'src/hooks/use-filtered-savings.hook';
import { useLoadOnEachBlock } from 'src/hooks/use-load-on-each-block.hook';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllSavingsAndStakesAction } from 'src/store/savings/actions';
import { useSavingsStakesLoadingSelector, useSavingsStakesSelector } from 'src/store/savings/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import {
  createItemsListWithLoader,
  earnOpportunityKeyExtractor,
  getRenderEarnOpportunityFn,
  LOADER_PLACEHOLDER
} from 'src/utils/earn-opportunities/list.utils';

import { MainInfo } from './main-info';
import { SavingsItemCard } from './savings-item-card';
import { SavingsSelectorsEnum } from './selectors';
import { useSavingsStyles } from './styles';

export const Savings: FC = () => {
  const stakes = useSavingsStakesSelector();
  const stakesLoading = useSavingsStakesLoadingSelector();
  const styles = useSavingsStyles();
  const {
    sortField,
    depositedOnly,
    filteredItemsList,
    shouldShowLoader,
    setSearchValue,
    handleSetSortField,
    handleToggleDepositOnly
  } = useFilteredSavings();

  usePageAnalytic(ScreensEnum.Savings);
  useLoadOnEachBlock(stakesLoading, loadAllSavingsAndStakesAction);

  const renderItem = useMemo<ListRenderItem<SavingsItem | typeof LOADER_PLACEHOLDER>>(
    () =>
      getRenderEarnOpportunityFn<SavingsItem>(
        () => (
          <ActivityIndicator
            style={filteredItemsList.length === 0 ? styles.emptyListLoader : styles.bottomLoader}
            size="large"
          />
        ),
        item => <SavingsItemCard item={item} lastStakeRecord={stakes[item.contractAddress]} />
      ),
    [filteredItemsList.length, stakes, styles.bottomLoader, styles.emptyListLoader]
  );

  const data = useMemo(
    () => createItemsListWithLoader(filteredItemsList, shouldShowLoader),
    [filteredItemsList, shouldShowLoader]
  );

  return (
    <>
      <MainInfo />
      <HorizontalBorder />
      <EarnOpportunitySearchPanel
        checkboxTestID={SavingsSelectorsEnum.depositedOnlyCheckbox}
        searchTestID={SavingsSelectorsEnum.search}
        sorterTestID={SavingsSelectorsEnum.sorter}
        sortField={sortField}
        depositedOnly={depositedOnly}
        handleToggleDepositOnly={handleToggleDepositOnly}
        setSearchValue={setSearchValue}
        handleSetSortField={handleSetSortField}
      />
      <HorizontalBorder />

      <Divider size={formatSize(8)} />
      <FlatList
        data={data}
        keyExtractor={earnOpportunityKeyExtractor}
        ListEmptyComponent={
          <DataPlaceholder
            text={
              Object.keys(stakes).length === 0 && depositedOnly ? 'You have no deposited savings' : 'No records found'
            }
          />
        }
        renderItem={renderItem}
      />
    </>
  );
};
