import React, { FC, useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, useWindowDimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { SIDEBAR_MARGINS, TABBAR_MARGINS } from 'src/constants/main-sizes';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { useScreenContainerStyles } from '../../../components/screen-container/screen-container.styles';
import { SIDEBAR_WIDTH } from '../../../config/styles';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { sliceIntoChunks } from '../../../utils/array.utils';
import { createGetItemLayout } from '../../../utils/flat-list.utils';
import { CollectiblesListStyles } from './collectibles-list.styles';
import { TouchableCollectibleIcon } from './touchable-collectible-icon/touchable-collectible-icon';

interface Props {
  collectiblesList: TokenInterface[];
}

const ITEMS_PER_ROW = 3;

const keyExtractor = (item: TokenInterface[]) => item.map(collectible => getTokenSlug(collectible)).join('/');

export const CollectiblesList: FC<Props> = ({ collectiblesList }) => {
  const styles = useScreenContainerStyles();
  const windowWidth = useWindowDimensions().width;
  const itemSize =
    (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS) / ITEMS_PER_ROW;

  const data = useMemo(() => sliceIntoChunks(collectiblesList, ITEMS_PER_ROW), [collectiblesList]);

  const getItemLayout = createGetItemLayout<TokenInterface[]>(itemSize);

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

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      style={styles.scrollView}
      contentContainerStyle={styles.scrollViewContentContainer}
      ListEmptyComponent={<DataPlaceholder text="Not found any NFT" />}
    />
  );
};
