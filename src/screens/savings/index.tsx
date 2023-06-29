import React, { FC, useEffect } from 'react';
import { ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { Divider } from 'src/components/divider/divider';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { loadAllSavingsAndStakesAction } from 'src/store/savings/actions';
import {
  useSavingsItemsLoadingSelector,
  useSavingsItemsSelector,
  useSavingsStakesSelector
} from 'src/store/savings/selectors';
import { formatSize } from 'src/styles/format-size';

import { MainInfo } from './main-info';
import { SavingsItemCard } from './savings-item-card';
import { useSavingsStyles } from './styles';

export const Savings: FC = () => {
  const dispatch = useDispatch();
  const savingsItems = useSavingsItemsSelector();
  const savingsItemsLoading = useSavingsItemsLoadingSelector();
  const savingsStakes = useSavingsStakesSelector();
  const blockLevel = useBlockLevel();
  const styles = useSavingsStyles();
  const pageIsLoading = savingsItemsLoading && savingsItems.length === 0;

  useEffect(() => {
    dispatch(loadAllSavingsAndStakesAction());
  }, [dispatch, blockLevel]);

  return (
    <>
      <MainInfo />
      <Divider size={formatSize(8)} />
      {pageIsLoading ? (
        <ActivityIndicator style={styles.loader} size="large" />
      ) : (
        <FlatList
          data={savingsItems}
          ListEmptyComponent={<DataPlaceholder text="No records found." />}
          renderItem={({ item }) => (
            <SavingsItemCard
              key={`${item.id}_${item.contractAddress}`}
              item={item}
              lastStakeRecord={savingsStakes[item.contractAddress]}
            />
          )}
        />
      )}
    </>
  );
};
