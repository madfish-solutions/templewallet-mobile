import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { chunk } from 'lodash-es';
import React, { FC, useCallback, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';

import { CollectiblesListStyles } from './collectibles-list.styles';
import { TouchableCollectibleIcon } from './touchable-collectible-icon/touchable-collectible-icon';

interface Props {
  collectiblesList: TokenInterface[];
}

const ITEMS_PER_ROW = 3;

const keyExtractor = (item: TokenInterface[]) => item.map(collectible => getTokenSlug(collectible)).join('/');

const TABBAR_MARGINS = formatSize(24);
const SIDEBAR_MARGINS = formatSize(51);

export const CollectiblesList: FC<Props> = ({ collectiblesList }) => {
  const { width: windowWidth } = useWindowDimensions();
  const itemSize = useMemo(
    () => (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS) / ITEMS_PER_ROW,
    [windowWidth]
  );
  const flooredItemSize = useMemo(() => Math.floor(itemSize), [itemSize]);

  const data = useMemo(() => chunk(collectiblesList, ITEMS_PER_ROW), [collectiblesList]);

  const renderItem: ListRenderItem<TokenInterface[]> = useCallback(
    ({ item }) => (
      <View style={CollectiblesListStyles.rowContainer}>
        {item.map((collectible, index) => (
          <TouchableCollectibleIcon key={index} collectible={collectible} size={itemSize} />
        ))}
      </View>
    ),
    [itemSize]
  );

  const ListEmptyComponent = useMemo(() => <DataPlaceholder text="Not found any NFT" />, []);

  return (
    <FlashList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      estimatedItemSize={flooredItemSize}
      contentContainerStyle={CollectiblesListStyles.contentContainer}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};
