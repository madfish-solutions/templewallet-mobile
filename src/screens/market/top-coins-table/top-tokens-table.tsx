import React from 'react';
import { View, Text, RefreshControl, ListRenderItem, FlatList } from 'react-native';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { useFakeRefreshControlProps } from '../../../hooks/use-fake-refresh-control-props.hook';
import { useFilterdMarketTokens } from '../../../hooks/use-filtered-market-tokens.hook';
import { MarketToken } from '../../../store/market/market.interfaces';
import { Filters } from './filters/filters';
import { SwipableRow } from './swipable-row/swipable-row';
import { useTopCoinsTableStyles } from './top-coins-table.styles';

const renderItem: ListRenderItem<MarketToken> = ({ item }) => <SwipableRow item={item} />;

export const TopTokensTable = () => {
  const styles = useTopCoinsTableStyles();
  const {
    filteredTokensList,
    sortFiled,
    segmentControlIndex,
    setSearchValue,
    handleSetSortField,
    handleSelectorChange
  } = useFilterdMarketTokens();

  const fakeRefreshControlProps = useFakeRefreshControlProps();

  const listEmptyComponent =
    segmentControlIndex === 0 ? (
      <DataPlaceholder text="No Market data were found" />
    ) : (
      <DataPlaceholder
        text="You have no favorites"
        subText="Hint: to add to favorites, swipe a token on the “Market tab” and tap the star icon."
      />
    );

  return (
    <View style={styles.rootContainer}>
      <Filters
        sortFiled={sortFiled}
        segmentControlIndex={segmentControlIndex}
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
        data={filteredTokensList}
        renderItem={renderItem}
        refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
        keyExtractor={item => item.id}
        ListEmptyComponent={listEmptyComponent}
      />
    </View>
  );
};
