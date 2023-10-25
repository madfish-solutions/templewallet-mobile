import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React, { FC, memo, useCallback, useMemo } from 'react';
import { ListRenderItem, useWindowDimensions, View } from 'react-native';
import { isTablet } from 'react-native-device-info';

import { ActivityIndicator } from 'src/components/activity-indicator';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import {
  SCREEN_HORIZONTAL_PADDING,
  useScreenContainerStyles
} from 'src/components/screen-container/screen-container.styles';
import { SIDEBAR_WIDTH } from 'src/config/styles';
import { useAreMetadatasLoadingSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { formatSize } from 'src/styles/format-size';
import { UsableAccountAsset } from 'src/utils/assets/types';
import { createGetItemLayout } from 'src/utils/flat-list.utils';

import { useCollectiblesGridStyles } from '../styles';
import { CollectibleItem } from './collectible-item';
import { useCollectibleItemStyles } from './collectible-item/styles';
import { CollectiblesListStyles, GRID_GAP } from './styles';

interface Props {
  collectibles: UsableAccountAsset[];
  isShowInfo: boolean;
}

const ITEMS_PER_ROW = 3;
const GRID_GAPS_TOTAL_WIDTH = GRID_GAP * (ITEMS_PER_ROW - 1);

const keyExtractor = (item: UsableAccountAsset) => item.slug;

export const CollectiblesList = memo<Props>(({ collectibles, isShowInfo }) => {
  const screenStyles = useScreenContainerStyles();
  const itemStyles = useCollectibleItemStyles();

  const areMetadatasLoading = useAreMetadatasLoadingSelector();
  const isSyncing = areMetadatasLoading;

  const { width: windowWidth } = useWindowDimensions();

  const itemSize = useMemo(() => {
    const gridWidth = isTablet()
      ? windowWidth - (SIDEBAR_WIDTH + formatSize(51))
      : windowWidth - 2 * SCREEN_HORIZONTAL_PADDING;

    return (gridWidth - GRID_GAPS_TOTAL_WIDTH) / ITEMS_PER_ROW;
  }, [windowWidth]);

  const getItemLayout = useMemo(
    () =>
      createGetItemLayout<UsableAccountAsset>(
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

  const renderItem: ListRenderItem<UsableAccountAsset> = useCallback(
    ({ item: collectible, index }) => (
      <CollectibleItem
        key={collectible.slug}
        slug={collectible.slug}
        collectible={collectible}
        isShowInfo={isShowInfo}
        size={itemSize}
        style={(index + 1) % ITEMS_PER_ROW !== 0 ? CollectiblesListStyles.marginRight : undefined}
      />
    ),
    [itemSize, isShowInfo]
  );

  return (
    <>
      <BottomSheetFlatList
        data={collectibles}
        numColumns={ITEMS_PER_ROW}
        initialNumToRender={ITEMS_PER_ROW * 15}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        style={screenStyles.scrollView}
        contentContainerStyle={screenStyles.scrollViewContentContainer}
        ListFooterComponent={<ListFooterComponent empty={collectibles.length < 1} isSyncing={isSyncing} />}
      />
    </>
  );
});

const ListFooterComponent: FC<{ empty: boolean; isSyncing: boolean }> = ({ empty, isSyncing }) => {
  if (empty) {
    return isSyncing ? <Spinner /> : <DataPlaceholder text="Not found any NFT" />;
  }

  return isSyncing ? <Spinner /> : null;
};

const Spinner = () => {
  const styles = useCollectiblesGridStyles();

  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" style={styles.loader} />
    </View>
  );
};
