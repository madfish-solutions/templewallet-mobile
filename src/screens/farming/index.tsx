import React, { FC, useCallback } from 'react';
import { ActivityIndicator, ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { EarnOpportunitySearchPanel } from 'src/components/earn-opportunity-search-panel';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { useFilteredFarmings } from 'src/hooks/use-filtered-farmings.hook';
import { useLoadOnEachBlock } from 'src/hooks/use-load-on-each-block.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllFarmsAndStakesAction } from 'src/store/farms/actions';
import { useFarmsStakesLoadingSelector, useLastFarmsStakesSelector } from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { Farm } from 'src/types/farm';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { FarmItem } from './farm-item';
import { MainInfo } from './main-info';
import { FarmsSelectorsEnum } from './selectors';
import { useFarmingStyles } from './styles';

const keyExtractor = ({ id, contractAddress }: Farm) => `${id}_${contractAddress}`;

export const Farming: FC = () => {
  const stakes = useLastFarmsStakesSelector();
  const stakesLoading = useFarmsStakesLoadingSelector();
  const styles = useFarmingStyles();
  const {
    sortField,
    depositedOnly,
    filteredItemsList,
    pageIsLoading,
    setSearchValue,
    handleSetSortField,
    handleToggleDepositOnly
  } = useFilteredFarmings();

  usePageAnalytic(ScreensEnum.Farming);
  useLoadOnEachBlock(stakesLoading, loadAllFarmsAndStakesAction);

  const renderItem = useCallback<ListRenderItem<Farm>>(
    ({ item }) => <FarmItem farm={item} lastStakeRecord={stakes[item.contractAddress]} />,
    [stakes]
  );

  return (
    <>
      <MainInfo />
      <HorizontalBorder />
      <EarnOpportunitySearchPanel
        checkboxTestID={FarmsSelectorsEnum.depositedOnlyCheckbox}
        searchTestID={FarmsSelectorsEnum.search}
        sorterTestID={FarmsSelectorsEnum.sorter}
        sortField={sortField}
        depositedOnly={depositedOnly}
        handleToggleDepositOnly={handleToggleDepositOnly}
        setSearchValue={setSearchValue}
        handleSetSortField={handleSetSortField}
      />
      <HorizontalBorder />
      {pageIsLoading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <>
          <Divider size={formatSize(8)} />
          <FlatList
            data={filteredItemsList}
            keyExtractor={keyExtractor}
            ListEmptyComponent={
              <DataPlaceholder
                text={
                  Object.keys(stakes).length === 0 && depositedOnly
                    ? 'You have no deposits in farms'
                    : 'No records found'
                }
              />
            }
            renderItem={renderItem}
          />
        </>
      )}
    </>
  );
};
