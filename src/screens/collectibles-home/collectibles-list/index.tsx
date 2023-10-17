import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { chunk } from 'lodash-es';
import React, { memo, useCallback, useMemo } from 'react';
import { ListRenderItem, useWindowDimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import {
  SCREEN_HORIZONTAL_PADDING,
  useScreenContainerStyles
} from 'src/components/screen-container/screen-container.styles';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { formatSize } from 'src/styles/format-size';
import { UsableAccountAsset } from 'src/utils/assets/types';
import { createGetItemLayout } from 'src/utils/flat-list.utils';

import { CollectibleItem } from './collectible-item';
import { useCollectibleItemStyles } from './collectible-item/styles';
import { CollectiblesListStyles, GRID_GAP } from './styles';

interface Props {
  collectibles: UsableAccountAsset[];
  isShowInfo: boolean;
}

const ITEMS_PER_ROW = 3;
const GRID_GAPS_TOTAL_WIDTH = GRID_GAP * (ITEMS_PER_ROW - 1);

const keyExtractor = (item: UsableAccountAsset[]) => item.map(({ slug }) => slug).join('/');

export const CollectiblesList = memo<Props>(({ collectibles, isShowInfo }) => {
  const styles = useScreenContainerStyles();
  const itemStyles = useCollectibleItemStyles();

  const { width: windowWidth } = useWindowDimensions();

  const itemSize = useMemo(() => {
    const gridWidth = isTablet()
      ? windowWidth - (SIDEBAR_WIDTH + formatSize(51))
      : windowWidth - 2 * SCREEN_HORIZONTAL_PADDING;

    return (gridWidth - GRID_GAPS_TOTAL_WIDTH) / ITEMS_PER_ROW;
  }, [windowWidth]);

  const data = useMemo(() => chunk(collectibles, ITEMS_PER_ROW), [collectibles]);

  const getItemLayout = useMemo(
    () =>
      createGetItemLayout<UsableAccountAsset[]>(
        isShowInfo
          ? itemSize +
              itemStyles.description.paddingTop +
              itemStyles.description.paddingBottom +
              itemStyles.name.fontSize +
              itemStyles.price.fontSize
          : itemSize,
        GRID_GAP
      ),
    [isShowInfo, itemSize, itemStyles]
  );

  const renderItem: ListRenderItem<UsableAccountAsset[]> = useCallback(
    ({ item }) => (
      <View style={CollectiblesListStyles.rowContainer}>
        {item.map((collectible, i) => (
          <CollectibleItem
            key={collectible.slug}
            slug={collectible.slug}
            collectible={collectible}
            isShowInfo={isShowInfo}
            size={itemSize}
            style={(i + 1) % 3 !== 0 ? CollectiblesListStyles.marginRight : undefined}
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
});
