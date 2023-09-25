import { isNonEmptyArray } from '@apollo/client/utilities';
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ListRenderItem, View, useWindowDimensions } from 'react-native';
import { isTablet } from 'react-native-device-info';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { StableDiffusionOrder } from 'src/apis/stable-diffusion/types';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { SIDEBAR_MARGINS, TABBAR_MARGINS } from 'src/constants/main-sizes';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { CollectibleImage } from 'src/screens/text-to-nft/components/collectible-image/collectible-image';
import { useHistoryStyles } from 'src/screens/text-to-nft/generate-art/tabs/history/history.styles';
import { HISTORY_MOCK_DATA } from 'src/screens/text-to-nft/generate-art/tabs/history/mock-data';
import { formatSize } from 'src/styles/format-size';
import { sliceIntoChunks } from 'src/utils/array.utils';
import { conditionalStyle } from 'src/utils/conditional-style';
import { createGetItemLayout } from 'src/utils/flat-list.utils';
import { isDefined } from 'src/utils/is-defined';

const ITEMS_PER_ROW = 3;
const OFFSET_BETWEEN_ICONS = formatSize(4);

const keyExtractor = (item: StableDiffusionOrder[]) => item.map(({ id }) => id).join('/');

export const History: FC = () => {
  const { navigate } = useNavigation();
  const styles = useHistoryStyles();

  // TODO: Remove fake loading state
  const [isLoadingData, setIsLoadingData] = useState(true);
  useEffect(() => {
    const timerId = setTimeout(() => setIsLoadingData(false), 2000);

    return () => clearTimeout(timerId);
  }, []);

  const windowWidth = useWindowDimensions().width;
  const itemSize =
    (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS) / ITEMS_PER_ROW -
    OFFSET_BETWEEN_ICONS;

  // TODO: Update mock data to API data
  const data = useMemo(() => sliceIntoChunks(HISTORY_MOCK_DATA, ITEMS_PER_ROW), [HISTORY_MOCK_DATA]);

  const getItemLayout = createGetItemLayout<StableDiffusionOrder[]>(itemSize);

  const handleCollectiblePress = (order: StableDiffusionOrder) => {
    navigate(ScreensEnum.Preview, { order });
  };

  const renderItem: ListRenderItem<StableDiffusionOrder[]> = useCallback(
    ({ item }) => (
      <View style={styles.row}>
        {item.map((order, i) =>
          isDefined(order.variants) && isNonEmptyArray(order.variants) ? (
            <TouchableOpacity key={order.id} onPress={() => handleCollectiblePress(order)}>
              <CollectibleImage
                uri={order.variants[0]}
                size={itemSize}
                style={[styles.collectible, conditionalStyle((i + 1) % 3 !== 0, styles.marginRight)]}
              />
            </TouchableOpacity>
          ) : null
        )}
      </View>
    ),
    [itemSize]
  );

  return (
    <View style={styles.root}>
      {!isLoadingData && (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          ListEmptyComponent={<DataPlaceholder text="Not found any NFT" />}
        />
      )}

      {isLoadingData && <ActivityIndicator size="large" />}
    </View>
  );
};
