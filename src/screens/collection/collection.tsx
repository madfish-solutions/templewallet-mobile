import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, Text, ListRenderItem, ViewToken } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { useCollectibleByCollectionInfo } from 'src/hooks/use-collectibles-by-collection.hook';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { useLayoutSizes } from 'src/hooks/use-layout-sizes.hook';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { formatSize } from 'src/styles/format-size';
import { emptyToken, TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';
import { valueByDecimals } from 'src/utils/number.util';

import { TouchableCollectibleIcon } from '../collectibles-home/collectibles-list/touchable-collectible-icon/touchable-collectible-icon';
import { useCollectionStyles } from './collection.styles';

const COLLECTIBLE_MARGIN = 4;

export const Collection = () => {
  const styles = useCollectionStyles();
  const { metadata } = useNetworkInfo();

  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Collection>>();
  const collectibles = useCollectibleByCollectionInfo(params.collectionContract);
  const data = [emptyToken, ...collectibles];

  const { layoutWidth, handleLayout } = useLayoutSizes();

  const { setInnerScreenIndex } = useInnerScreenProgress(collectibles.length);

  const handleChanged = useCallback((info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
    if (isDefined(info.viewableItems) && isDefined(info.viewableItems?.[0].index)) {
      info.viewableItems?.[0].index === 0
        ? setInnerScreenIndex(0)
        : setInnerScreenIndex(info.viewableItems[0].index - 1);
    }
  }, []);

  const renderItem: ListRenderItem<TokenInterface> = ({ item }) => {
    if (item.address === '') {
      return <View style={styles.emptyBlock} />;
    }

    return (
      <View style={styles.collectibleContainer} onLayout={handleLayout}>
        {isDefined(item.lowestAsk) && (
          <View style={styles.listed}>
            <Text style={styles.listedText}>LISTED</Text>
          </View>
        )}
        <View style={styles.collectible}>
          <TouchableCollectibleIcon iconSize={CollectibleIconSize.BIG} collectible={item} size={formatSize(285)} />
          <Text style={styles.collectibleName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.collectibleDescription} numberOfLines={3}>
            {item.description}
          </Text>
          <View style={styles.infoContainer}>
            <View style={styles.containerRight}>
              <View style={styles.smallContainer}>
                <Text style={styles.text}>Last Price</Text>
                <Text style={styles.value}>
                  {isDefined(item.lastPrice) ? `${valueByDecimals(item.lastPrice, metadata.decimals)} TEZ` : '---'}
                </Text>
              </View>
            </View>
            <View style={styles.containerLeft}>
              <View style={styles.smallContainer}>
                <Text style={styles.text}>Editions</Text>
                <Text style={styles.value}>{item.editions}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={data}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleChanged}
        snapToInterval={formatSize(layoutWidth - COLLECTIBLE_MARGIN)}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50
        }}
        decelerationRate={0}
        scrollEventThrottle={16}
        keyExtractor={item => `${item.address}_${item.id}`}
        ListEmptyComponent={<DataPlaceholder text="Not found any NFT" />}
      />
    </View>
  );
};
