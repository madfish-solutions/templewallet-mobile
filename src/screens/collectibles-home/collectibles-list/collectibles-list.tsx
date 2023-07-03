import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { FC, useCallback, useMemo } from 'react';
import { ListRenderItem, useWindowDimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { DataPlaceholder } from '../../../components/data-placeholder/data-placeholder';
import { useScreenContainerStyles } from '../../../components/screen-container/screen-container.styles';
import { SIDEBAR_WIDTH } from '../../../config/styles';
import { TokenInterface } from '../../../token/interfaces/token.interface';
import { getTokenSlug } from '../../../token/utils/token.utils';
import { sliceIntoChunks } from '../../../utils/array.utils';
import { conditionalStyle } from '../../../utils/conditional-style';
import { createGetItemLayout } from '../../../utils/flat-list.utils';
import { CollectiblesListStyles } from './collectibles-list.styles';
import { TouchableCollectibleIcon } from './touchable-collectible-icon/touchable-collectible-icon';

interface Props {
  collectiblesList: TokenInterface[];
  isShowInfo: boolean;
}

const ITEMS_PER_ROW = 3;

const keyExtractor = (item: TokenInterface[]) => item.map(collectible => getTokenSlug(collectible)).join('/');

const TABBAR_MARGINS = 32;
const SIDEBAR_MARGINS = 51;
const OFFSET_BETWEEN_ICONS = 4;

export const CollectiblesList: FC<Props> = ({ collectiblesList, isShowInfo }) => {
  const styles = useScreenContainerStyles();
  const windowWidth = useWindowDimensions().width;
  const itemSize =
    (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS) / ITEMS_PER_ROW -
    OFFSET_BETWEEN_ICONS;

  const data = useMemo(() => sliceIntoChunks(collectiblesList, ITEMS_PER_ROW), [collectiblesList]);

  const getItemLayout = createGetItemLayout<TokenInterface[]>(itemSize);

  const renderItem: ListRenderItem<TokenInterface[]> = useCallback(
    ({ item }) => (
      <View style={CollectiblesListStyles.rowContainer}>
        {item.map((collectible, i) => (
          <TouchableCollectibleIcon
            key={getTokenSlug(collectible)}
            collectible={collectible}
            isShowInfo={isShowInfo}
            size={itemSize}
            style={[
              CollectiblesListStyles.collectible,
              conditionalStyle((i + 1) % 3 !== 0, CollectiblesListStyles.marginRight)
            ]}
          />
        ))}
      </View>
    ),
    [itemSize, isShowInfo]
  );

  return (
    <BottomSheetFlatList
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
