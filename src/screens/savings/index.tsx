import React, { FC, useCallback, useEffect } from 'react';
import { ActivityIndicator, ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { EarnOpportunitySearchPanel } from 'src/components/earn-opportunity-search-panel';
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
