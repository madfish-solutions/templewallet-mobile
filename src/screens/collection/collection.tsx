import { isNonEmptyArray } from '@apollo/client/utilities';
import { RouteProp, useRoute } from '@react-navigation/native';
import React, { useCallback, useMemo, useState } from 'react';
import { ListRenderItem, ViewToken, ScrollView, View, ActivityIndicator } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';

import { PAGINATION_STEP_FA, PAGINATION_STEP_GALLERY } from 'src/apis/objkt/constants';
import { DataPlaceholder } from 'src/components/data-placeholder/data-placeholder';
import { ObjktTypeEnum } from 'src/enums/objkt-type.enum';
import { useCollectibleByCollectionInfo } from 'src/hooks/use-collectibles-by-collection.hook';
import { useInnerScreenProgress } from 'src/hooks/use-inner-screen-progress';
import { ScreensEnum, ScreensParamList } from 'src/navigator/enums/screens.enum';
import { useSelectedRpcUrlSelector } from 'src/store/settings/settings-selectors';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { TokenInterface } from 'src/token/interfaces/token.interface';
import { isDefined } from 'src/utils/is-defined';

import { useCollectionStyles } from './collection.styles';
import { CollectibleItem } from './components/collectible-item';

const COLLECTIBLE_SIZE = 327;
const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 50,
  minimumViewTime: 0
};

const keyExtractor = (item: TokenInterface) => `${item.address}_${item.id}`;

export const Collection = () => {
  const styles = useCollectionStyles();
  const selectedAccount = useSelectedAccountSelector();
  const { params } = useRoute<RouteProp<ScreensParamList, ScreensEnum.Collection>>();
  const [offset, setOffset] = useState<number>(0);
  const selectedRpc = useSelectedRpcUrlSelector();

  const { collectibles, isLoading } = useCollectibleByCollectionInfo(
    params.collectionContract,
    selectedAccount.publicKeyHash,
    params.type,
    offset,
    params.galleryId
  );

  const PAGINATION_STEP = useMemo(
    () => (params.type === ObjktTypeEnum.faContract ? PAGINATION_STEP_FA : PAGINATION_STEP_GALLERY),
    []
  );

  const screenProgressAmount = useMemo(
    () =>
      params.type === ObjktTypeEnum.gallery ? collectibles?.[0]?.items ?? collectibles.length : collectibles.length,
    [collectibles]
  );

  const { setInnerScreenIndex } = useInnerScreenProgress(screenProgressAmount);

  const handleChanged = useCallback((info: { viewableItems: ViewToken[] }) => {
    if (isNonEmptyArray(info.viewableItems) && isDefined(info.viewableItems[0].index)) {
      setInnerScreenIndex(info.viewableItems[0].index);
    }
  }, []);

  const snapToInterval = useMemo(() => {
    return formatSize(COLLECTIBLE_SIZE) + formatSize(4) + formatSize(4);
  }, []);

  const renderItem: ListRenderItem<TokenInterface> = useCallback(
    ({ item }) => (
      <CollectibleItem
        item={item}
        collectionContract={params.collectionContract}
        selectedRpc={selectedRpc}
        selectedPublicKeyHash={selectedAccount.publicKeyHash}
      />
    ),
    []
  );

  const footerComponent = () =>
    isLoading && collectibles.length % PAGINATION_STEP === 0 ? (
      <View style={[styles.collectibleContainer, styles.loader]}>
        <ActivityIndicator size="large" />
      </View>
    ) : (
      <View style={styles.emptyBlock} />
    );

  const emptyComponent = () => (
    <View style={styles.emptyContainer}>
      <DataPlaceholder text="Not found any NFT" />
    </View>
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.scrollViewContainer}>
      {isLoading && offset === 0 ? (
        <View>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={collectibles}
          renderItem={renderItem}
          horizontal
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={handleChanged}
          removeClippedSubviews={true}
          snapToInterval={snapToInterval}
          viewabilityConfig={VIEWABILITY_CONFIG}
          decelerationRate={0}
          scrollEventThrottle={16}
          disableIntervalMomentum
          keyExtractor={keyExtractor}
          onEndReached={() => {
            if (collectibles.length % PAGINATION_STEP === 0 && !isLoading) {
              setOffset(offset + PAGINATION_STEP);
            }
          }}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={emptyComponent}
          ListFooterComponent={footerComponent}
          ListHeaderComponent={<View style={styles.emptyBlock} />}
          windowSize={3}
          initialNumToRender={3}
        />
      )}
    </ScrollView>
  );
};
