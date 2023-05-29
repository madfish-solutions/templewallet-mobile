import { isNonEmptyArray } from '@apollo/client/utilities';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, ListRenderItem, ViewToken } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { useCollectibleByCollectionInfo } from 'src/hooks/use-collectibles-by-collection.hook';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface, emptyToken } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';

import { useCollectionStyles } from './collection.styles';
import { CollectibleItem } from './components/collectible-item';

const COLLECTIBLE_SIZE = 327;

export const Collection = () => {
  const styles = useCollectionStyles();
  const selectedAccount = useSelectedAccountSelector();
  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Collection>>();

  const collectibles = useCollectibleByCollectionInfo(
    params.collectionContract,
    selectedAccount.publicKeyHash,
    params.type,
    params.galleryId
  );

  const { setInnerScreenIndex } = useInnerScreenProgress(collectibles.length);

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
    <CollectibleItem item={item} collectionContract={params.collectionContract} />
  );

  const data = [emptyToken, ...collectibles];

  return (
    <View style={styles.root}>
      {data.length > 1 ? (
        <FlatList
          data={data}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleChanged}
          snapToInterval={formatSize(COLLECTIBLE_SIZE)}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 50
          }}
          decelerationRate={0}
          scrollEventThrottle={16}
          keyExtractor={item => `${item.address}_${item.id}`}
        />
      ) : (
        <DataPlaceholder text="Not found any NFT" />
      )}
    </View>
  );
};
