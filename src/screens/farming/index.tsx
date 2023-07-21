import React, { FC, useCallback, useEffect } from 'react';
import { ActivityIndicator, ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { Farm } from 'src/apis/quipuswap-staking/types';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { EarnOpportunitySearchPanel } from 'src/components/earn-opportunity-search-panel';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { useFilteredFarmings } from 'src/hooks/use-filtered-farmings.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllFarmsAndStakesAction } from 'src/store/farms/actions';
import { useLastFarmsStakesSelector } from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { FarmItem } from './farm-item';
import { MainInfo } from './main-info';
import { FarmsSelectorsEnum } from './selectors';
import { useFarmingStyles } from './styles';

const keyExtractor = ({ id, contractAddress }: Farm) => `${id}_${contractAddress}`;

export const Farming: FC = () => {
  const dispatch = useDispatch();
  const farmsStakes = useLastFarmsStakesSelector();
  const blockLevel = useBlockLevel();
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

  const renderItem = useCallback<ListRenderItem<Farm>>(
    ({ item }) => (
      <FarmItem
        farm={item}
        lastStakeRecord={farmsStakes.data[item.contractAddress]}
        stakeIsLoading={farmsStakes.isLoading}
      />
    ),
    [farmsStakes.data, farmsStakes.isLoading]
  );

  useEffect(() => {
    dispatch(loadAllFarmsAndStakesAction());
  }, [dispatch, blockLevel]);

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
                text={Object.keys(farmsStakes.data).length === 0 ? 'You have no deposited savings' : 'No records found'}
              />
            }
            renderItem={renderItem}
          />
        </>
      )}
    </>
  );
};
