import { isNonEmptyArray } from '@apollo/client/utilities';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { ListRenderItem, ViewToken, ScrollView, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { useCollectibleByCollectionInfo } from 'src/hooks/use-collectibles-by-collection.hook';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';

import { useCollectionStyles } from './collection.styles';
import { CollectibleItem } from './components/collectible-item';

const COLLECTIBLE_SIZE = 335;

export const Collection = () => {
  const styles = useCollectionStyles();
  const selectedAccount = useSelectedAccountSelector();
  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Collection>>();
  const [offset, setOffset] = useState<number>(0);
  const [itemWidth, setItemWidth] = useState(formatSize(COLLECTIBLE_SIZE));

  const collectibles = useCollectibleByCollectionInfo(
    params.collectionContract,
    selectedAccount.publicKeyHash,
    params.type,
    offset,
    params.galleryId
  );

  const { setInnerScreenIndex } = useInnerScreenProgress(collectibles?.[0]?.items ?? collectibles.length);

  const handleChanged = useCallback((info: { viewableItems: ViewToken[] }) => {
    if (isNonEmptyArray(info.viewableItems) && isDefined(info.viewableItems[0].index)) {
      if (info.viewableItems[0].index === 0) {
        setInnerScreenIndex(0);
      } else {
        setInnerScreenIndex(info.viewableItems[0].index - 1);
      }
    }
  }, []);

  const renderItem: ListRenderItem<TokenInterface> = ({ item }) => (
    <CollectibleItem item={item} collectionContract={params.collectionContract} setWidth={setItemWidth} />
  );

  return (
    <ScrollView style={styles.root}>
      <FlatList
        data={collectibles}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleChanged}
        removeClippedSubviews={true}
        snapToInterval={itemWidth + formatSize(8)}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
          minimumViewTime: 100
        }}
        decelerationRate={0}
        scrollEventThrottle={16}
        keyExtractor={item => `${item.address}_${item.id}`}
        onEndReached={() => setOffset(offset + 15)}
        onEndReachedThreshold={1}
        ListFooterComponent={<View style={styles.emptyBlock} />}
        ListHeaderComponent={<View style={styles.emptyBlock} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <DataPlaceholder text="Not found any NFT" />
          </View>
        }
      />
    </ScrollView>
  );
};
