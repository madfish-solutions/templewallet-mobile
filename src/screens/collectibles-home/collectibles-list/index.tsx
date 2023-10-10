import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { chunk } from 'lodash-es';
import React, { memo, useCallback, useMemo } from 'react';
import { ListRenderItem, useWindowDimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { useScreenContainerStyles } from 'src/components/screen-container/screen-container.styles';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { formatSize } from 'src/styles/format-size';
import { UsableAccountAsset } from 'src/utils/assets/hooks';
import { createGetItemLayout } from 'src/utils/flat-list.utils';

import { CollectibleItem } from './collectible-item';
import { CollectiblesListStyles } from './styles';

interface Props {
  collectibles: UsableAccountAsset[];
  isShowInfo: boolean;
}

const ITEMS_PER_ROW = 3;

const keyExtractor = (item: UsableAccountAsset[]) => item.map(({ slug }) => slug).join('/');

const TABBAR_MARGINS = formatSize(32);
const SIDEBAR_MARGINS = formatSize(51);
const OFFSET_BETWEEN_ICONS = formatSize(4);

export const CollectiblesList = memo<Props>(({ collectibles, isShowInfo }) => {
  const styles = useScreenContainerStyles();

  const { width: windowWidth } = useWindowDimensions();

  const itemSize = useMemo(
    () =>
      (isTablet() ? windowWidth - (SIDEBAR_WIDTH + SIDEBAR_MARGINS) : windowWidth - TABBAR_MARGINS) / ITEMS_PER_ROW -
      OFFSET_BETWEEN_ICONS,
    [windowWidth]
  );

  const data = useMemo(() => chunk(collectibles, ITEMS_PER_ROW), [collectibles]);

  const getItemLayout = useMemo(() => createGetItemLayout<UsableAccountAsset[]>(itemSize), [itemSize]);

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
