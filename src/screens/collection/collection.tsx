import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { View, Text, ListRenderItem, ViewToken, TouchableOpacity } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { CollectibleIconSize } from 'src/components/collectible-icon/collectible-icon.props';
import { useCollectibleByCollectionInfo } from 'src/hooks/use-collectibles-by-collection.hook';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { useNetworkInfo } from 'src/hooks/use-network-info.hook';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { conditionalStyle } from 'src/utils/conditional-style';
import { isDefined } from 'src/utils/is-defined';
import { valueToDecimals } from 'src/utils/number.util';

import { TouchableCollectibleIcon } from '../collectibles-home/collectibles-list/touchable-collectible-icon/touchable-collectible-icon';
import { useCollectionStyles } from './collection.styles';

export const Collection = () => {
  const styles = useCollectionStyles();
  const { metadata } = useNetworkInfo();
  const selectedAccount = useSelectedAccountSelector();

  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Collection>>();
  const collectibles = useCollectibleByCollectionInfo(params.collectionContract);

  const { setInnerScreenIndex } = useInnerScreenProgress(collectibles.length);

  const handleChanged = useCallback((info: { viewableItems: ViewToken[]; changed: ViewToken[] }) => {
    if (isDefined(info.viewableItems) && isDefined(info.viewableItems?.[0].index)) {
      setInnerScreenIndex(info.viewableItems[0].index);
    }
  }, []);

  const renderItem: ListRenderItem<TokenInterface> = ({ item }) => {
    const price = isDefined(item.lowestAsk) ? `${valueToDecimals(item.lowestAsk, metadata.decimals)} TEZ` : '---';
    const highestOffer = isDefined(item.highestOffer)
      ? `${valueToDecimals(item.highestOffer, metadata.decimals)} TEZ`
      : 'No offers yet';
    const holders = item?.holders?.map(holder => holder.holder_address) ?? [];
    const isHolder = holders.includes(selectedAccount.publicKeyHash);
    const isOffersExited = isDefined(item.highestOffer);

    return (
      <View style={styles.collectibleContainer}>
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
                <Text style={styles.text}>Floor Price</Text>
                <Text style={styles.value}>{price}</Text>
              </View>
            </View>
            <View style={styles.containerLeft}>
              <View style={styles.smallContainer}>
                <Text style={styles.text}>Editions</Text>
                <Text style={styles.value}>{item.editions}</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              disabled={!isOffersExited}
              style={[
                styles.sellButton,
                conditionalStyle(isOffersExited, styles.sellButtonActive, styles.sellButtonDisabled)
              ]}
            >
              <Text
                style={[
                  styles.sellButtonText,
                  conditionalStyle(isOffersExited, styles.sellButtonActive, styles.sellButtonDisabled)
                ]}
              >
                {isHolder ? (isOffersExited ? `Sell for ${highestOffer}` : 'No offers yet') : 'buy'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

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
