import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { FlatList, ListRenderItem, useWindowDimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { OrderStatus, StableDiffusionOrder } from 'src/apis/stable-diffusion/types';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { SIDEBAR_MARGINS, TABBAR_MARGINS } from 'src/constants/main-sizes';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { CollectibleImage } from 'src/screens/text-to-nft/components/collectible-image/collectible-image';
import { GenerateArtSelectors } from 'src/screens/text-to-nft/generate-art/selectors';
import { useHistoryStyles } from 'src/screens/text-to-nft/generate-art/tabs/history/history.styles';
import { loadTextToNftOrdersActions } from 'src/store/text-to-nft/text-to-nft-actions';
import { useTextToNftOrdersSelector } from 'src/store/text-to-nft/text-to-nft-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { sliceIntoChunks } from 'src/utils/array.utils';
import { conditionalStyle } from 'src/utils/conditional-style';
import { createGetItemLayout } from 'src/utils/flat-list.utils';
import { isDefined } from 'src/utils/is-defined';

const ITEMS_PER_ROW = 3;
const OFFSET_BETWEEN_ICONS = formatSize(4);

const keyExtractor = (item: StableDiffusionOrder[]) => item.map(({ id }) => id).join('/');

export const History = memo(() => {
  const dispatch = useDispatch();
  const { publicKeyHash } = useSelectedAccountSelector();
  const { navigate } = useNavigation();
  const styles = useHistoryStyles();

  const orders = useTextToNftOrdersSelector(publicKeyHash);

  useEffect(() => void dispatch(loadTextToNftOrdersActions.submit(publicKeyHash)), [publicKeyHash]);

  const windowWidth = useWindowDimensions().width;
  const itemSize =
    (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS) / ITEMS_PER_ROW -
    OFFSET_BETWEEN_ICONS;

  const data = useMemo(() => sliceIntoChunks(orders, ITEMS_PER_ROW), [orders]);

  const getItemLayout = createGetItemLayout<StableDiffusionOrder[]>(itemSize);

  const handleCollectiblePress = (order: StableDiffusionOrder) => {
    navigate(ScreensEnum.Preview, { orderId: order.id });
  };

  const renderItem: ListRenderItem<StableDiffusionOrder[]> = useCallback(
    ({ item }) => (
      <View style={styles.row}>
        {item.map((order, i) => (
          <TouchableOpacity
            key={order.id}
            onPress={() => handleCollectiblePress(order)}
            testID={GenerateArtSelectors.historyItem}
          >
            <CollectibleImage
              uri={isDefined(order.variants) ? order.variants[0] : ''}
              size={itemSize}
              showLoader={order.status === OrderStatus.Pending}
              style={[styles.collectible, conditionalStyle((i + 1) % 3 !== 0, styles.marginRight)]}
            />
          </TouchableOpacity>
        ))}
      </View>
    ),
    [itemSize]
  );

  return (
    <View style={styles.root}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        ListEmptyComponent={<DataPlaceholder text="Not found any NFT" />}
      />
    </View>
  );
});
