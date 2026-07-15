import BottomSheet from '@gorhom/bottom-sheet';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ListRenderItem, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useSharedValue } from 'react-native-reanimated';

import { CurrentAccountDropdown } from 'src/components/account-dropdown/current-account-dropdown';
import { CheckboxIcon } from 'src/components/checkbox-icon/checkbox-icon';
import { DeadEndBoundaryError } from 'src/components/error-boundary';
import { HeaderCard } from 'src/components/header-card/header-card';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { ImageWithIndicator } from 'src/components/image';
import { Search } from 'src/components/search/search';
import { useEtherlinkDataLoading } from 'src/hooks/evm/use-etherlink-data-loading.hook';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { dispatch } from 'src/store';
import { loadCollectionsActions } from 'src/store/collectons/collections-actions';
import { useCreatedCollectionsSelector } from 'src/store/collectons/collections-selectors';
import { Collection } from 'src/store/collectons/collections-state';
import { switchIsShowCollectibleInfoAction } from 'src/store/settings/settings-actions';
import { useIsShowCollectibleInfoSelector } from 'src/store/settings/settings-selectors';
import { useAccountAddressForEvm, useAccountAddressForTezos } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { useCurrentAccountCollectibles, useCurrentAccountEvmCollectibles } from 'src/utils/assets/hooks';
import { useDidUpdate } from 'src/utils/hooks';
import { formatObjktLogoUri } from 'src/utils/image.utils';

import { CollectiblesList } from './collectibles-list';
import { useCollectiblesHomeStyles, useCollectionButtonStyles } from './styles';

export const CollectiblesHome = memo(() => {
  const navigateToScreen = useNavigateToScreen();
  usePageAnalytic(ScreensEnum.CollectiblesHome);

  const collections = useCreatedCollectionsSelector();
  const tezosCollectibles = useCurrentAccountCollectibles(true);
  const evmCollectibles = useCurrentAccountEvmCollectibles();
  const collectibles = useMemo(() => tezosCollectibles.concat(evmCollectibles), [tezosCollectibles, evmCollectibles]);
  const tezosAddress = useAccountAddressForTezos();
  const evmAddress = useAccountAddressForEvm();

  useEtherlinkDataLoading();

  if (!tezosAddress && !evmAddress) {
    throw new DeadEndBoundaryError();
  }

  const isShowCollectibleInfo = useIsShowCollectibleInfoSelector();

  const styles = useCollectiblesHomeStyles();

  const [screenHeight, setScreenHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [profileHeight, setProfileHeight] = useState(0);

  const hasCollections = collections.length > 0;

  const snapPoints = useMemo(() => {
    const firstSnapPoint = screenHeight - headerHeight;
    if (firstSnapPoint < 1) {
      return null;
    }

    const secondSnapPoint = firstSnapPoint + profileHeight;

    return !hasCollections || firstSnapPoint === secondSnapPoint ? [firstSnapPoint] : [firstSnapPoint, secondSnapPoint];
  }, [screenHeight, headerHeight, profileHeight, hasCollections]);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const animatedIndex = useSharedValue(-1);
  const firstSnapPoint = snapPoints?.[0];
  // gorhom v5 + reanimated v4: the mount animation sometimes never starts, leaving the
  // sheet stuck closed off-screen (animatedIndex stays -1), detect it and snap into place manually
  useEffect(() => {
    if (firstSnapPoint == null) {
      return;
    }

    let ticks = 0;
    const id = setInterval(() => {
      if (animatedIndex.value > -0.9 || ++ticks > 10) {
        clearInterval(id);

        return;
      }

      bottomSheetRef.current?.snapToPosition(firstSnapPoint);
    }, 300);

    return () => clearInterval(id);
  }, [firstSnapPoint, animatedIndex]);

  useEffect(() => {
    if (tezosAddress != null) {
      dispatch(loadCollectionsActions.submit(tezosAddress));
    }
  }, [tezosAddress]);

  const { setSearchValue, filteredAssetsList } = useFilteredAssetsList(collectibles);

  const handleSwitchShowInfo = () => void dispatch(switchIsShowCollectibleInfoAction());

  const renderItemCollections: ListRenderItem<Collection> = useCallback(
    ({ item }) => <CollectionButton item={item} />,
    []
  );

  const collectionsFlatListRef = useRef<FlatList<Collection>>(null);
  // On collections number decrease scroll might not reposition & items remain off-view
  useDidUpdate(() => void collectionsFlatListRef.current?.scrollToOffset({ offset: 0 }), [tezosAddress]);

  return (
    <View style={styles.screen} onLayout={event => void setScreenHeight(event.nativeEvent.layout.height)}>
      <HeaderCard
        hasInsetTop={true}
        style={styles.headerCard}
        onLayout={event => void setHeaderHeight(event.nativeEvent.layout.height)}
      >
        <View style={styles.accountContainer}>
          <CurrentAccountDropdown isCollectibleScreen />
        </View>

        <View
          onLayout={event => void setProfileHeight(event.nativeEvent.layout.height)}
          style={styles.profileContainer}
        >
          {collections.length > 0 ? (
            <>
              <View style={styles.collectionsHeader}>
                <Text style={styles.collectionsLabel}>Created collections</Text>
              </View>

              <FlatList
                ref={collectionsFlatListRef}
                data={collections}
                renderItem={renderItemCollections}
                keyExtractor={({ type, contract, galleryPk }) => `${type}/${contract}/${galleryPk}`}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.collectionsContainer}
              />
            </>
          ) : null}
        </View>
      </HeaderCard>

      {snapPoints ? (
        <BottomSheet
          ref={bottomSheetRef}
          animatedIndex={animatedIndex}
          enableDynamicSizing={false}
          snapPoints={snapPoints}
          handleStyle={styles.handleStyle}
          style={styles.bottomSheet}
          backgroundStyle={styles.bottomSheet}
        >
          <View style={styles.infoContainer}>
            <CheckboxIcon
              text="Show info"
              initialState={isShowCollectibleInfo}
              onActive={handleSwitchShowInfo}
              onDisactive={handleSwitchShowInfo}
            />

            <View style={styles.icons}>
              <Search onChange={setSearchValue} dividerSize={16}>
                <TouchableIcon
                  name={IconNameEnum.EditNew}
                  onPress={() => navigateToScreen({ screen: ScreensEnum.ManageAssets, params: { collectibles: true } })}
                />
              </Search>
            </View>
          </View>

          <CollectiblesList collectibles={filteredAssetsList} showInfo={isShowCollectibleInfo} />
        </BottomSheet>
      ) : null}
    </View>
  );
});

interface CollectionLogoProps {
  item: Collection;
}

const CollectionButton = memo<CollectionLogoProps>(({ item }) => {
  const navigateToScreen = useNavigateToScreen();

  const handleCollectionPress = () =>
    navigateToScreen({
      screen: ScreensEnum.Collection,
      params: {
        collectionContract: item.contract,
        collectionName: item.name,
        type: item.type,
        galleryPk: item.galleryPk
      }
    });

  const styles = useCollectionButtonStyles();

  return (
    <TouchableOpacity style={styles.button} onPress={handleCollectionPress}>
      <ImageWithIndicator
        source={{ uri: formatObjktLogoUri(item.logo) }}
        style={styles.logo}
        imageStyle={styles.image}
        indicator={ActivityIndicator}
        renderError={() => (
          <View style={[styles.image, styles.brokenImage]}>
            <Icon name={IconNameEnum.NFTCollection} size={formatSize(31)} />
          </View>
        )}
      />

      <Text numberOfLines={1} style={styles.title}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );
});
