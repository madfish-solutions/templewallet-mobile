import React, { useRef } from 'react';
import { View, Text, RefreshControl, ListRenderItem } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { useFakeRefreshControlProps } from '../../../hooks/use-fake-refresh-control-props.hook';
import { useFilterdMarketTokens } from '../../../hooks/use-filtered-market-tokens.hook';
import { MarketToken } from '../../../store/market/market.interfaces';
import { formatSize } from '../../../styles/format-size';
import { Filters } from './filters/filters';
import { RightSwipeView } from './right-swipe-view/right-swipe-view';
import { Row } from './row/row';
import { useTopTokensTableStyles } from './top-tokens-table.styles';

const renderItem: ListRenderItem<MarketToken> = ({ item }) => <Row {...item} />;
export const TopTokensTable = () => {
  const styles = useTopTokensTableStyles();
  const {
    filteredTokensList,
    sortFiled,
    segmentControlIndex,
    setSearchValue,
    handleSetSortField,
    handleSelectorChange
  } = useFilterdMarketTokens();
  const ref = useRef<SwipeListView<MarketToken | { id: string }>>(null);

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

  const closeAllOpenRows = () => ref.current?.closeAllOpenRows();

  const handleSelectorChangeAndSwipeClose = (index: number) => {
    handleSelectorChange(index);
    closeAllOpenRows();
  };

  return (
    <View style={styles.rootContainer}>
      <Filters
        sortFiled={sortFiled}
        segmentControlIndex={segmentControlIndex}
        onSetSortValue={handleSetSortField}
        onSearchValueChange={setSearchValue}
        onSelectorChange={handleSelectorChangeAndSwipeClose}
      />
      <View style={styles.columns}>
        <Text style={[styles.text, styles.name]}>NAME</Text>
        <Text style={styles.text}>PRICE</Text>
        <Text style={styles.text}>24H</Text>
        <Text style={styles.text}>VOLUME (24H)</Text>
      </View>
      <View style={styles.listContainer}>
        <SwipeListView
          scrollEnabled
          disableRightSwipe
          ref={ref}
          data={filteredTokensList}
          renderItem={renderItem}
          renderHiddenItem={({ item }) => <RightSwipeView id={item.id} onPress={closeAllOpenRows} />}
          refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
          keyExtractor={item => item.id}
          rightOpenValue={formatSize(-148)}
          ListEmptyComponent={listEmptyComponent}
        />
      </View>
    </View>
  );
};
