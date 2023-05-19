import React, { FC, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { Checkbox } from 'src/components/checkbox/checkbox';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { Search } from 'src/components/search/search';
import { Sorter } from 'src/components/sorter/sorter';
import { FarmsSortFieldEnum } from 'src/enums/farms-sort-fields.enum';
import { useFilteredFarms } from 'src/hooks/use-filtered-farms.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadAllFarmsActions } from 'src/store/farms/actions';
import { useLastStakesSelector } from 'src/store/farms/selectors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { EarmSelectorsEnum } from './earn.selectors';
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

export const Earn: FC = () => {
  const dispatch = useDispatch();
  usePageAnalytic(ScreensEnum.Earn);
  const stakes = useLastStakesSelector();
  const styles = useEarnStyles();

  const {
    filteredFarmsList,
    sortField,
    depositedOnly,
    isFarmsLoading,
    handleToggleDepositOnly,
    setSearchValue,
    handleSetSortField
  } = useFilteredFarms();

  useEffect(() => {
    dispatch(loadAllFarmsActions.submit());
  }, []);

  return (
    <>
      <MainInfo />
      <View style={[styles.row, styles.container]}>
        <View style={styles.row}>
          <Checkbox value={depositedOnly} onChange={handleToggleDepositOnly}>
            <Text style={styles.depositText}>Deposit only</Text>
          </Checkbox>
        </View>
        <Search placeholder="Search farm" onChange={setSearchValue} dividerSize={12} testID={EarmSelectorsEnum.search}>
          <Sorter
            bottomSheetContentHeight={264}
            sortValue={sortField}
            description="Sort by:"
            sortFieldsOptions={earnSortFieldsOptions}
            sortFieldsLabels={earnSortFieldsLabels}
            onSetSortValue={handleSetSortField}
            testID={EarmSelectorsEnum.sorter}
          />
        </Search>
      </View>
      <ScreenContainer>
        {isFarmsLoading ? (
          <ActivityIndicator style={styles.loader} size="large" />
        ) : (
          <FlatList
            data={filteredFarmsList}
            ListEmptyComponent={<DataPlaceholder text="No records found." />}
            renderItem={farm => <FarmItem farm={farm.item} lastStakeRecord={stakes[farm.item.item.contractAddress]} />}
          />
        )}
      </ScreenContainer>
    </>
  );
};
