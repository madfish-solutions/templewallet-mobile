import { FlashList, ListRenderItem } from '@shopify/flash-list';
import React, { FC, useCallback, useMemo } from 'react';
import { useWindowDimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { useScreenContainerStyles } from 'src/components/screen-container/screen-container.styles';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { sliceIntoChunks } from 'src/utils/array.utils';

import { CollectiblesListStyles } from './collectibles-list.styles';
import { TouchableCollectibleIcon } from './touchable-collectible-icon/touchable-collectible-icon';

interface Props {
  collectiblesList: TokenInterface[];
}

const ITEMS_PER_ROW = 3;

const keyExtractor = (item: TokenInterface[]) => item.map(collectible => getTokenSlug(collectible)).join('/');

const TABBAR_MARGINS = 32;
const SIDEBAR_MARGINS = 51;

export const CollectiblesList: FC<Props> = ({ collectiblesList }) => {
  const styles = useScreenContainerStyles();
  const windowWidth = useWindowDimensions().width;
  const itemSize =
    (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS) / ITEMS_PER_ROW;

  const data = useMemo(() => sliceIntoChunks(collectiblesList, ITEMS_PER_ROW), [collectiblesList]);

  const renderItem: ListRenderItem<TokenInterface[]> = useCallback(
    ({ item }) => (
      <View style={CollectiblesListStyles.rowContainer}>
        {item.map(collectible => (
          <TouchableCollectibleIcon key={getTokenSlug(collectible)} collectible={collectible} size={itemSize} />
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
      estimatedItemSize={Math.floor(itemSize)}
      contentContainerStyle={styles.scrollViewContentContainer}
      ListEmptyComponent={ListEmptyComponent}
    />
  );
};
