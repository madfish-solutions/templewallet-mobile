import React, { useCallback } from 'react';
import { View, Text, RefreshControl, ListRenderItem, FlatList } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { useFakeRefreshControlProps } from '../../../hooks/use-fake-refresh-control-props.hook';
import { useFilterdMarketCoins } from '../../../hooks/use-filtered-market-coins.hook';
import { MarketCoin } from '../../../store/market/market.interfaces';
import { Filters } from './filters/filters';
import { RightSwipeView } from './right-swipe-view/right-swipe-view';
import { Row } from './row/row';
import { useTableStyles } from './table.styles';

export const Table = () => {
  const styles = useTableStyles();
  const { filteredAssetsList, sortFiled, inputTypeIndex, setSearchValue, handleSetSortField, handleSelectorChange } =
    useFilterdMarketCoins();

  const fakeRefreshControlProps = useFakeRefreshControlProps();

  const renderItem: ListRenderItem<MarketCoin> = useCallback(
    ({ item }) => (
      <Swipeable renderRightActions={() => <RightSwipeView slug={`${item.id}-${item.symbol}`} />}>
        <Row item={item} />
      </Swipeable>
    ),
    []
  );

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
        <Text style={[styles.text, styles.name]}>NAME</Text>
        <Text style={[styles.text, styles.price]}>PRICE</Text>
        <Text style={[styles.text, styles.h24]}>24H</Text>
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
