import React, { FC, useCallback, useEffect } from 'react';
import { ActivityIndicator, ListRenderItem, Text, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { Checkbox } from 'src/components/checkbox/checkbox';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { Search } from 'src/components/search/search';
import { Sorter } from 'src/components/sorter/sorter';
import { EarnOpportunitiesSortFieldEnum } from 'src/enums/earn-opportunities-sort-fields.enum';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { useFilteredSavings } from 'src/hooks/use-filtered-savings.hook';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useStakesLoadingSelector } from 'src/store/farms/selectors';
import { loadAllSavingsAndStakesAction } from 'src/store/savings/actions';
import { useSavingsStakesSelector } from 'src/store/savings/selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { MainInfo } from './main-info';
import { SavingsItemCard } from './savings-item-card';
import { SavingsSelectorsEnum } from './selectors';
import { useSavingsStyles } from './styles';

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

const keyExtractor = ({ id, contractAddress }: SavingsItem) => `${id}_${contractAddress}`;

export const Savings: FC = () => {
  const dispatch = useDispatch();
  const savingsStakes = useSavingsStakesSelector();
  const stakesLoading = useStakesLoadingSelector();
  const blockLevel = useBlockLevel();
  const styles = useSavingsStyles();
  const {
    sortField,
    depositedOnly,
    filteredItemsList,
    pageIsLoading,
    setSearchValue,
    handleSetSortField,
    handleToggleDepositOnly
  } = useFilteredSavings();

  usePageAnalytic(ScreensEnum.Savings);

  const renderItem = useCallback<ListRenderItem<SavingsItem>>(
    ({ item }) => (
      <SavingsItemCard
        item={item}
        lastStakeRecord={savingsStakes[item.contractAddress]}
        stakeIsLoading={stakesLoading}
      />
    ),
    [savingsStakes, stakesLoading]
  );

  useEffect(() => {
    dispatch(loadAllSavingsAndStakesAction());
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
              testID={SavingsSelectorsEnum.search}
            >
              <Sorter
                bottomSheetContentHeight={264}
                sortValue={sortField}
                description="Sort by:"
                sortFieldsOptions={earnSortFieldsOptions}
                sortFieldsLabels={earnSortFieldsLabels}
                onSetSortValue={handleSetSortField}
                testID={SavingsSelectorsEnum.sorter}
              />
            </Search>
          </View>
          <Divider size={formatSize(8)} />
          <FlatList
            data={filteredItemsList}
            keyExtractor={keyExtractor}
            ListEmptyComponent={
              <DataPlaceholder
                text={Object.keys(savingsStakes).length === 0 ? 'You have no deposited savings' : 'No records found'}
              />
            }
            renderItem={renderItem}
          />
        </>
      )}
    </>
  );
};
