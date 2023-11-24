import { RouteProp, useRoute } from '@react-navigation/native';
import React, { FC, memo, useCallback, useMemo } from 'react';
import { ListRenderItem, ViewToken, ScrollView, View, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { CollectionItemInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { isDefined } from 'src/utils/is-defined';

import { CollectibleItem } from './components/collectible-item';
import { useCollectionStyles, useCollectionClosingComponentStyles } from './styles';
import { useCollectionItemsLoading } from './use-items-loading';
import { ITEM_WIDTH, GAP_SIZE } from './utils';

const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 0
};

const keyExtractor = (item: CollectionItemInterface) => `${item.address}_${item.id}`;

export const Collection = memo(() => {
  const styles = useCollectionStyles();
  const accountPkh = useCurrentAccountPkhSelector();
  const {
    params: { collectionContract, galleryPk }
  } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Collection>>();

  const { collectibles, isLoading, collectionSize, loadMore } = useCollectionItemsLoading(
    collectionContract,
    accountPkh,
    galleryPk
  );

  const { setInnerScreenIndex } = useInnerScreenProgress(collectionSize ?? collectibles.length);

  const onViewableItemsChanged = useCallback((info: { viewableItems: ViewToken[] }) => {
    const index = info.viewableItems[0]?.index;
    if (isDefined(index)) {
      setInnerScreenIndex(index);
    }
  }, []);

  const snapToInterval = useMemo(() => formatSize(ITEM_WIDTH) + formatSize(GAP_SIZE), []);

  const renderItem: ListRenderItem<CollectionItemInterface> = useCallback(
    ({ item }) => <CollectibleItem item={item} collectionContract={collectionContract} accountPkh={accountPkh} />,
    [accountPkh]
  );

  const onEndReached = useCallback(() => {
    if (collectibles.length) {
      loadMore();
    }
  }, [collectibles.length, loadMore]);

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scrollViewContainer}>
      <FlatList
        contentContainerStyle={styles.contentContainerStyle}
        data={collectibles}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        removeClippedSubviews={true}
        snapToInterval={snapToInterval}
        viewabilityConfig={VIEWABILITY_CONFIG}
        decelerationRate={0}
        scrollEventThrottle={16}
        disableIntervalMomentum
        keyExtractor={keyExtractor}
        onEndReached={onEndReached}
        initialNumToRender={3}
        onEndReachedThreshold={0.5}
        windowSize={3}
        ListFooterComponent={<ListFooterComponent empty={collectibles.length < 1} isLoading={isLoading} />}
      />
    </ScrollView>
  );
});

const ListFooterComponent: FC<{ empty: boolean; isLoading: boolean }> = ({ empty, isLoading }) => {
  const styles = useCollectionClosingComponentStyles();

  if (empty) {
    return isLoading ? (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <View style={styles.emptyContainer}>
        <DataPlaceholder text="Not found any NFT" />
      </View>
    );
  }

  return isLoading ? (
    <View style={styles.loader}>
      <ActivityIndicator size="large" />
    </View>
  ) : null;
};
