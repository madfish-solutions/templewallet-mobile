import React, { useRef, useState } from 'react';
import { ListRenderItem, RefreshControl, Text, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { OptimalPromotionItem } from 'src/components/optimal-promotion-item/optimal-promotion-item';
import { useFakeRefreshControlProps } from 'src/hooks/use-fake-refresh-control-props.hook';
import { useFilteredMarketTokens } from 'src/hooks/use-filtered-market-tokens.hook';
import { MarketToken } from 'src/store/market/market.interfaces';
import { formatSize } from 'src/styles/format-size';

import { MarketSelectors } from '../market.selectors';

import { Filters } from './filters/filters';
import { RightSwipeView } from './right-swipe-view/right-swipe-view';
import { Row } from './row/row';
import { useTopTokensTableStyles } from './top-tokens-table.styles';

const renderItem: ListRenderItem<MarketToken> = ({ item }) => <Row {...item} />;
const keyExtractor = (item: MarketToken) => item.id;

export const TopTokensTable = () => {
  const styles = useTopTokensTableStyles();
  const {
    filteredTokensList,
    sortFiled,
    segmentControlIndex,
    setSearchValue,
    handleSetSortField,
    handleSelectorChange
  } = useFilteredMarketTokens();
  const ref = useRef<SwipeListView<MarketToken>>(null);
  const [promotionErrorOccurred, setPromotionErrorOccurred] = useState(false);

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
      {!promotionErrorOccurred && (
        <OptimalPromotionItem
          style={styles.promotion}
          testID={MarketSelectors.promotion}
          onImageError={() => setPromotionErrorOccurred(true)}
          onEmptyPromotionReceived={() => setPromotionErrorOccurred(true)}
        />
      )}
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
          ref={ref}
          scrollEnabled
          disableRightSwipe
          data={filteredTokensList}
          renderItem={renderItem}
          renderHiddenItem={({ item }) => <RightSwipeView id={item.id} onPress={closeAllOpenRows} />}
          refreshControl={<RefreshControl {...fakeRefreshControlProps} />}
          keyExtractor={keyExtractor}
          rightOpenValue={formatSize(-148)}
          ListEmptyComponent={listEmptyComponent}
          windowSize={10}
          updateCellsBatchingPeriod={150}
        />
      </View>
    </View>
  );
};
