import { RouteProp, useRoute } from '@react-navigation/native';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { ListRenderItem, ViewToken, ScrollView, View, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { PAGINATION_STEP_FA, PAGINATION_STEP_GALLERY } from 'src/apis/objkt/constants';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { CollectionItemInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { isDefined } from 'src/utils/is-defined';

import { useCollectionStyles } from './collection.styles';
import { CollectibleItem } from './components/collectible-item';
import { useCollectionItemsLoading } from './utils/use-collection-items-loading.hook';

const COLLECTIBLE_SIZE = 327;
const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 0
};

const keyExtractor = (item: CollectionItemInterface) => `${item.address}_${item.id}`;

export const Collection = memo(() => {
  const styles = useCollectionStyles();
  const accountPkh = useCurrentAccountPkhSelector();
  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Collection>>();
  const [offset, setOffset] = useState<number>(0);
  const selectedRpc = useSelectedRpcUrlSelector();

  const { collectibles, isLoading } = useCollectionItemsLoading(
    params.collectionContract,
    accountPkh,
    offset,
    params.galleryPk
  );

  const PAGINATION_STEP = useMemo(() => (params.type === 'fa' ? PAGINATION_STEP_FA : PAGINATION_STEP_GALLERY), []);

  const screenProgressAmount = useMemo(
    () => (params.type === 'gallery' ? collectibles[0]?.collectionSize ?? collectibles.length : collectibles.length),
    [collectibles, params.type]
  );

  const { setInnerScreenIndex } = useInnerScreenProgress(screenProgressAmount);

  const handleChanged = useCallback((info: { viewableItems: ViewToken[] }) => {
    const item = info.viewableItems[0];
    if (isDefined(item?.index)) {
      setInnerScreenIndex(item.index);
    }
  }, []);

  const snapToInterval = useMemo(() => {
    return formatSize(COLLECTIBLE_SIZE) + formatSize(4) + formatSize(4);
  }, []);

  const renderItem: ListRenderItem<CollectionItemInterface> = useCallback(
    ({ item }) => (
      <CollectibleItem
        item={item}
        collectionContract={params.collectionContract}
        selectedRpc={selectedRpc}
        accountPkh={accountPkh}
      />
    ),
    []
  );

  const footerComponent = () =>
    isLoading && collectibles.length % PAGINATION_STEP === 0 ? (
      <View style={[styles.collectibleContainer, styles.loader]}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <View style={styles.emptyBlock} />
    );

  const emptyComponent = () => (
    <View style={styles.emptyContainer}>
      <DataPlaceholder text="Not found any NFT" />
    </View>
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scrollViewContainer}>
      {isLoading && offset === 0 ? (
        <View>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={collectibles}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleChanged}
          removeClippedSubviews={true}
          snapToInterval={snapToInterval}
          viewabilityConfig={VIEWABILITY_CONFIG}
          decelerationRate={0}
          scrollEventThrottle={16}
          disableIntervalMomentum
          keyExtractor={keyExtractor}
          onEndReached={() => {
            if (collectibles.length % PAGINATION_STEP === 0 && !isLoading) {
              setOffset(offset + PAGINATION_STEP);
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={emptyComponent}
          ListFooterComponent={footerComponent}
          ListHeaderComponent={<View style={styles.emptyBlock} />}
          windowSize={3}
          initialNumToRender={3}
        />
      )}
    </ScrollView>
  );
});
