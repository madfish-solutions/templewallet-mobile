import React, { useCallback, useRef, useState } from 'react';
import { ListRenderItem, RefreshControl, Text, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { PromotionItem } from 'src/components/promotion-item';
import { useFakeRefreshControlProps } from 'src/hooks/use-fake-refresh-control-props.hook';
import { useFilteredMarketTokens } from 'src/hooks/use-filtered-market-tokens.hook';
import { useInternalAdsAnalytics } from 'src/hooks/use-internal-ads-analytics.hook';
import { useOutsideOfListIntersection } from 'src/hooks/use-outside-of-list-intersection.hook';
import { MarketToken } from 'src/store/market/market.interfaces';
import { formatSize } from 'src/styles/format-size';

import { MarketSelectors } from '../market.selectors';

import { Filters } from './filters/filters';
import { RightSwipeView } from './right-swipe-view/right-swipe-view';
import { Row } from './row/row';
import { useTopTokensTableStyles } from './top-tokens-table.styles';

const renderItem: ListRenderItem<MarketToken> = ({ item }) => <Row {...item} />;
const keyExtractor = (item: MarketToken) => item.id;

const PROMOTION_ID = 'market-promotion';

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

  const adRef = useRef<View>(null);
  const adParentRef = useRef<View>(null);
  const adPageName = 'Market';
  const { onAdLoad, onIsVisible } = useInternalAdsAnalytics(adPageName, undefined, false);
  const { onElementOrParentLayout } = useOutsideOfListIntersection(adParentRef, adRef, onIsVisible);

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

  const closeAllOpenRows = useCallback(() => ref.current?.closeAllOpenRows(), []);

  const handlePromotionError = useCallback(() => setPromotionErrorOccurred(true), []);

  const handleSelectorChangeAndSwipeClose = (index: number) => {
    handleSelectorChange(index);
    closeAllOpenRows();
  };

  return (
    <View style={styles.rootContainer}>
      {!promotionErrorOccurred && (
        <View style={styles.promotionWrapper} ref={adParentRef} onLayout={onElementOrParentLayout}>
          <PromotionItem
            id={PROMOTION_ID}
            shouldRefreshAd
            testID={MarketSelectors.promotion}
            pageName={adPageName}
            onLoad={onAdLoad}
            onError={handlePromotionError}
            onLayout={onElementOrParentLayout}
            ref={adRef}
          />
        </View>
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
