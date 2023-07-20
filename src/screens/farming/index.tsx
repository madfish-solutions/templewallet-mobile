import React, { FC, useCallback, useEffect } from 'react';
import { ActivityIndicator, ListRenderItem, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { Farm } from 'src/apis/quipuswap-staking/types';
import { Checkbox } from 'src/components/checkbox/checkbox';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { Search } from 'src/components/search/search';
import { Sorter } from 'src/components/sorter/sorter';
import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
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

const earnSortFieldsLabels = {
  [EarnOpportunitiesSortFieldEnum.Default]: 'Default',
  [EarnOpportunitiesSortFieldEnum.APY]: 'Rate',
  [EarnOpportunitiesSortFieldEnum.Oldest]: 'Oldest',
  [EarnOpportunitiesSortFieldEnum.Newest]: 'Newest'
};

const earnSortFieldsOptions = [
  EarnOpportunitiesSortFieldEnum.Default,
  EarnOpportunitiesSortFieldEnum.APY,
  EarnOpportunitiesSortFieldEnum.Oldest,
  EarnOpportunitiesSortFieldEnum.Newest
];

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
    ({ item }) => <FarmItem farm={item} lastStakeRecord={farmsStakes.data[item.contractAddress]} stakeIsLoading={farmsStakes.isLoading} />,
    [farmsStakes.data, farmsStakes.isLoading]
  );

  useEffect(() => {
    dispatch(loadAllFarmsAndStakesAction());
  }, [dispatch, blockLevel]);

  return (
    <>
      <MainInfo />
      {pageIsLoading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <>
          <View style={[styles.row, styles.container]}>
            <View style={styles.row}>
              <Checkbox
                value={depositedOnly}
                size={formatSize(16)}
                strokeWidth={formatSize(2)}
                onChange={handleToggleDepositOnly}
              >
                <Divider size={formatSize(4)} />
                <Text style={styles.depositText}>Deposited only</Text>
              </Checkbox>
            </View>
            <Search
              placeholder="Search farm"
              onChange={setSearchValue}
              dividerSize={12}
              testID={FarmsSelectorsEnum.search}
            >
              <Sorter
                bottomSheetContentHeight={264}
                sortValue={sortField}
                description="Sort by:"
                sortFieldsOptions={earnSortFieldsOptions}
                sortFieldsLabels={earnSortFieldsLabels}
                onSetSortValue={handleSetSortField}
                testID={FarmsSelectorsEnum.sorter}
              />
            </Search>
          </View>
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
