import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, ListRenderItem, ViewToken } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { useCollectibleByCollectionInfo } from 'src/hooks/use-collectibles-by-collection.hook';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';

import { useCollectionStyles } from './collection.styles';
import { CollectibleItem } from './components/collectible-item';

export const Collection = () => {
  const styles = useCollectionStyles();
  const selectedAccount = useSelectedAccountSelector();
  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Collection>>();

  const collectibles = useCollectibleByCollectionInfo(params.collectionContract, selectedAccount.publicKeyHash);

  const { setInnerScreenIndex } = useInnerScreenProgress(collectibles.length);

  const handleChanged = useCallback((info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
    if (isDefined(info.viewableItems) && isDefined(info.viewableItems?.[0].index)) {
      setInnerScreenIndex(info.viewableItems[0].index);
    }
  }, []);

  const renderItem: ListRenderItem<TokenInterface> = ({ item }) => (
    <CollectibleItem item={item} collectionContract={params.collectionContract} />
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={collectibles}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
      />
    </View>
  );
};
