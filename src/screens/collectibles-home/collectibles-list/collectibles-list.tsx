import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { chunk } from 'lodash-es';
import React, { FC, useCallback, useMemo } from 'react';
import { ListRenderItem, useWindowDimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { AudioPlaceholderTheme } from 'src/components/audio-placeholder/audio-placeholder';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { useScreenContainerStyles } from 'src/components/screen-container/screen-container.styles';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { formatSize } from 'src/styles/format-size';
import { CollectibleInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { getTokenSlug } from 'src/token/utils/token.utils';
import { conditionalStyle } from 'src/utils/conditional-style';
import { createGetItemLayout } from 'src/utils/flat-list.utils';

import { CollectiblesListStyles } from './collectibles-list.styles';
import { TouchableCollectibleIcon } from './touchable-collectible-icon/touchable-collectible-icon';

interface Props {
  collectibles: CollectibleInterface[];
  isShowInfo: boolean;
}

const ITEMS_PER_ROW = 3;

const keyExtractor = (item: CollectibleInterface[]) => item.map(collectible => getTokenSlug(collectible)).join('/');

const TABBAR_MARGINS = formatSize(32);
const SIDEBAR_MARGINS = formatSize(51);
const OFFSET_BETWEEN_ICONS = formatSize(4);

export const CollectiblesList: FC<Props> = ({ collectibles, isShowInfo }) => {
  const styles = useScreenContainerStyles();
  const windowWidth = useWindowDimensions().width;
  const itemSize =
    (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS) / ITEMS_PER_ROW -
    OFFSET_BETWEEN_ICONS;

  const data = useMemo(() => chunk(collectibles, ITEMS_PER_ROW), [collectibles]);

  const getItemLayout = createGetItemLayout<CollectibleInterface[]>(itemSize);

  const renderItem: ListRenderItem<CollectibleInterface[]> = useCallback(
    ({ item }) => (
      <View style={CollectiblesListStyles.rowContainer}>
        {item.map((collectible, i) => {
          const slug = getTokenSlug(collectible);

          return (
            <TouchableCollectibleIcon
              key={slug}
              slug={slug}
              collectible={collectible}
              mime={collectible.mime}
              isShowInfo={isShowInfo}
              audioPlaceholderTheme={AudioPlaceholderTheme.small}
              size={itemSize}
              style={[
                CollectiblesListStyles.collectible,
                conditionalStyle((i + 1) % 3 !== 0, CollectiblesListStyles.marginRight)
              ]}
            />
          );
        })}
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
