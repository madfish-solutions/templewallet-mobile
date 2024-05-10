import React, { FC, useCallback, useMemo } from 'react';
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

const LOADER_PLACEHOLDER = 'loader-placeholder';

const keyExtractor = (item: Farm | typeof LOADER_PLACEHOLDER) =>
  item === LOADER_PLACEHOLDER ? LOADER_PLACEHOLDER : `${item.id}_${item.contractAddress}`;

export const Farming: FC = () => {
  const stakes = useLastFarmsStakesSelector();
  const stakesLoading = useFarmsStakesLoadingSelector();
  const styles = useFarmingStyles();
  const {
    sortField,
    depositedOnly,
    filteredItemsList,
    shouldShowLoader,
    setSearchValue,
    handleSetSortField,
    handleToggleDepositOnly
  } = useFilteredFarmings();

  usePageAnalytic(ScreensEnum.Farming);
  useLoadOnEachBlock(stakesLoading, loadAllFarmsAndStakesAction);

  const renderItem = useCallback<ListRenderItem<Farm | typeof LOADER_PLACEHOLDER>>(
    ({ item }) =>
      item === LOADER_PLACEHOLDER ? (
        <ActivityIndicator
          style={filteredItemsList.length === 0 ? styles.onlyLoader : styles.bottomLoader}
          size="large"
        />
      ) : (
        <FarmItem farm={item} lastStakeRecord={stakes[item.contractAddress]} />
      ),
    [filteredItemsList.length, stakes, styles.bottomLoader, styles.onlyLoader]
  );

  const data = useMemo(() => {
    const initialItems: Array<Farm | typeof LOADER_PLACEHOLDER> = filteredItemsList;

    return shouldShowLoader ? initialItems.concat(LOADER_PLACEHOLDER) : initialItems;
  }, [filteredItemsList, shouldShowLoader]);

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
      <Divider size={formatSize(8)} />
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        ListEmptyComponent={
          <DataPlaceholder
            text={
              Object.keys(stakes).length === 0 && depositedOnly ? 'You have no deposits in farms' : 'No records found'
            }
          />
        }
        renderItem={renderItem}
      />
    </>
  );
};
