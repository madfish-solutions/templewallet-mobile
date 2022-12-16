import React, { useCallback } from 'react';
import { View, Text, RefreshControl, ListRenderItem, FlatList } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { useFakeRefreshControlProps } from '../../../hooks/use-fake-refresh-control-props.hook';
import { useFilterdMarketCoins } from '../../../hooks/use-filtered-market-coins.hook';
import { MarketCoin } from '../../../store/market/market.interfaces';
import { Filters } from './filters/filters';
import { SwipableRow } from './swipable-row/swipable-row';
import { useTopCoinsTableStyles } from './top-coins-table.styles';

export const TopCoinsTable = () => {
  const styles = useTopCoinsTableStyles();
  const { filteredAssetsList, sortFiled, inputTypeIndex, setSearchValue, handleSetSortField, handleSelectorChange } =
    useFilterdMarketCoins();

  const fakeRefreshControlProps = useFakeRefreshControlProps();

  const renderItem: ListRenderItem<MarketCoin> = useCallback(({ item }) => <SwipableRow item={item} />, []);

  return (
    <View style={styles.rootContainer}>
      <Filters
        sortFiled={sortFiled}
        inputTypeIndex={inputTypeIndex}
        onSetSortValue={handleSetSortField}
        onSearchValueChange={setSearchValue}
        onSelectorChange={handleSelectorChange}
      />
      <View style={styles.columns}>
        <Text style={styles.text}>NAME</Text>
        <Text style={[styles.text, styles.price]}>PRICE</Text>
        <Text style={styles.text}>24H</Text>
        <Text style={styles.text}>VOLUME (24H)</Text>
      </View>
      <FlatList
        scrollEnabled
        data={filteredAssetsList}
        renderItem={renderItem}
        refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={<DataPlaceholder text="No records found." />}
      />
    </View>
  );
};
