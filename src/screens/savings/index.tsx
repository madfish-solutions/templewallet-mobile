import React, { FC, useCallback, useEffect } from 'react';
import { ActivityIndicator, ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { useBlockLevel } from 'src/hooks/use-block-level.hook';
import { SavingsItem } from 'src/interfaces/earn-opportunity/savings-item.interface';
import { loadAllSavingsAndStakesAction } from 'src/store/savings/actions';
import {
  useSavingsItemsLoadingSelector,
  useSavingsItemsSelector,
  useSavingsStakesSelector
} from 'src/store/savings/selectors';

import { SavingsItemCard } from './savings-item-card';
import { useSavingsStyles } from './styles';

const savingsKeyExtractor = (item: SavingsItem) => `${item.id}_${item.contractAddress}`;

export const Savings: FC = () => {
  const dispatch = useDispatch();
  const savingsItems = useSavingsItemsSelector();
  const savingsItemsLoading = useSavingsItemsLoadingSelector();
  const savingsStakes = useSavingsStakesSelector();
  const blockLevel = useBlockLevel();
  const styles = useSavingsStyles();
  const pageIsLoading = savingsItemsLoading && savingsItems.length === 0;

  const renderItem = useCallback<ListRenderItem<SavingsItem>>(
    ({ item }) => <SavingsItemCard item={item} lastStakeRecord={savingsStakes[item.contractAddress]} />,
    [savingsStakes]
  );

  useEffect(() => {
    dispatch(loadAllSavingsAndStakesAction());
  }, [dispatch, blockLevel]);

  return pageIsLoading ? (
    <ActivityIndicator style={styles.loader} size="large" />
  ) : (
    <FlatList
      data={savingsItems}
      keyExtractor={savingsKeyExtractor}
      ListEmptyComponent={<DataPlaceholder text="No records found." />}
      renderItem={renderItem}
    />
  );
};
