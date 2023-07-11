import React, { FC, useCallback, useEffect } from 'react';
import { ActivityIndicator, View, Text, ListRenderItemInfo } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { SingleFarmResponse } from 'src/apis/quipuswap-staking/types';
import { Checkbox } from 'src/components/checkbox/checkbox';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { HorizontalBorder } from 'src/components/horizontal-border';
import { Search } from 'src/components/search/search';
import { Sorter } from 'src/components/sorter/sorter';
import { FarmsSortFieldEnum } from 'src/enums/farms-sort-fields.enum';
import { useFilteredFarms } from 'src/hooks/use-filtered-farms.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllFarmsAndStakesAction } from 'src/store/farms/actions';
import { useLastStakesSelector } from 'src/store/farms/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { EarnSelectorsEnum } from './earn.selectors';

import { useEarnStyles } from './earn.styles';
import { FarmItem } from './farm-item/farm-item';
import { MainInfo } from './main-info/main-info';

const earnSortFieldsLabels: Record<FarmsSortFieldEnum, string> = {
  [FarmsSortFieldEnum.Default]: 'Default',
  [FarmsSortFieldEnum.APY]: 'APY',
  [FarmsSortFieldEnum.Oldest]: 'Oldest',
  [FarmsSortFieldEnum.Newest]: 'Newest'
};

const earnSortFieldsOptions: Array<FarmsSortFieldEnum> = [
  FarmsSortFieldEnum.Default,
  FarmsSortFieldEnum.APY,
  FarmsSortFieldEnum.Oldest,
  FarmsSortFieldEnum.Newest
];

const keyExtractor = (farm: SingleFarmResponse) => `${farm.item.contractAddress}_${farm.item.id}`;

export const Earn: FC = () => {
  const dispatch = useDispatch();
  const styles = useEarnStyles();
  const stakes = useLastStakesSelector();

  const {
    filteredFarmsList,
    isFarmsLoading,
    sortField,
    depositedOnly,
    handleToggleDepositOnly,
    setSearchValue,
    handleSetSortField
  } = useFilteredFarms();

  useEffect(() => {
    dispatch(loadAllFarmsAndStakesAction());
  }, []);

  usePageAnalytic(ScreensEnum.Earn);

  const renderItem = useCallback(
    (farm: ListRenderItemInfo<SingleFarmResponse>) => (
      <FarmItem farm={farm.item} lastStakeRecord={stakes[farm.item.item.contractAddress]} />
    ),
    [stakes]
  );

  return (
    <>
      <MainInfo />
      <HorizontalBorder />
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
        <Search placeholder="Search farm" onChange={setSearchValue} dividerSize={12} testID={EarnSelectorsEnum.search}>
          <Sorter
            bottomSheetContentHeight={264}
            sortValue={sortField}
            description="Sort by:"
            sortFieldsOptions={earnSortFieldsOptions}
            sortFieldsLabels={earnSortFieldsLabels}
            onSetSortValue={handleSetSortField}
            testID={EarnSelectorsEnum.sorter}
          />
        </Search>
      </View>
      <HorizontalBorder />
      {Boolean(isFarmsLoading) ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <>
          <Divider size={formatSize(8)} />
          <FlatList
            data={filteredFarmsList}
            keyExtractor={keyExtractor}
            ListEmptyComponent={<DataPlaceholder text="No records found." />}
            renderItem={renderItem}
          />
        </>
      )}
    </>
  );
};
