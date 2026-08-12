import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, LayoutChangeEvent, ListRenderItem, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from 'react-native-reanimated';

import { CurrentAccountDropdown } from 'src/components/account-dropdown/current-account-dropdown';
import { Divider } from 'src/components/divider/divider.tsx';
import { HeaderCard } from 'src/components/header-card/header-card';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { ImageWithIndicator } from 'src/components/image';
import { SearchInput } from 'src/components/search-input/search-input';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { useEtherlinkDataLoading } from 'src/hooks/evm/use-etherlink-data-loading.hook';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { dispatch } from 'src/store';
import { loadCollectionsActions } from 'src/store/collectons/collections-actions';
import { useCreatedCollectionsSelector } from 'src/store/collectons/collections-selectors';
import { Collection } from 'src/store/collectons/collections-state';
import { useIsShowCollectibleInfoSelector } from 'src/store/settings/settings-selectors';
import { useAccount } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForTezos } from 'src/utils/account.utils.ts';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { useCurrentAccountCollectibles, useCurrentAccountEvmCollectibles } from 'src/utils/assets/hooks';
import { DisplayedCollectible } from 'src/utils/assets/types';
import { useDidUpdate } from 'src/utils/hooks';
import { formatObjktLogoUri } from 'src/utils/image.utils';
import { isString } from 'src/utils/is-string';
import { isAssetSearched } from 'src/utils/token-metadata.utils';

import { ActionButton } from '../wallet/action-button';

import { CollectiblesList } from './collectibles-list';
import { useCollectiblesHomeStyles, useCollectionButtonStyles } from './styles';

const COLLECTIONS_SCROLL_RATIO = 4;

export const CollectiblesHome = memo(() => {
  const navigateToScreen = useNavigateToScreen();
  usePageAnalytic(ScreensEnum.CollectiblesHome);

  const account = useAccount();
  const collections = useCreatedCollectionsSelector();
  const tezosCollectibles = useCurrentAccountCollectibles(true);
  const evmCollectibles = useCurrentAccountEvmCollectibles();

  useEtherlinkDataLoading();

  const isShowCollectibleInfo = useIsShowCollectibleInfoSelector();

  const styles = useCollectiblesHomeStyles();
  const listTranslateY = useSharedValue<`${number}%`>('100%');
  const collectionsVisibility = useSharedValue(1);
  const collectionsSectionHeight = useSharedValue(0);

  const listAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: listTranslateY.value }]
  }));
  const collectionsAnimatedStyle = useAnimatedStyle(() => {
    const sectionHeight = collectionsSectionHeight.value;

    return {
      height: sectionHeight === 0 ? undefined : sectionHeight * collectionsVisibility.value,
      opacity: collectionsVisibility.value
    };
  });

  useEffect(() => {
    listTranslateY.value = withTiming('0%', {
      duration: 300,
      easing: Easing.out(Easing.cubic)
    });
  }, [listTranslateY]);

  useEffect(() => {
    const tezosAddress = getAccountAddressForTezos(account);

    if (tezosAddress) {
      dispatch(loadCollectionsActions.submit(tezosAddress));
    }
  }, [account.id]);

  useEffect(() => {
    collectionsVisibility.value = 1;
  }, [collectionsVisibility, account.id]);

  const {
    setSearchValue,
    searchValue,
    filteredAssetsList: filteredTezosCollectibles
  } = useFilteredAssetsList(tezosCollectibles);

  const collectibles = useMemo<DisplayedCollectible[]>(() => {
    const searchValueLowercased = searchValue?.toLowerCase();
    const filteredEvmCollectibles = isString(searchValueLowercased)
      ? evmCollectibles.filter(({ metadata, tokenId }) =>
          isAssetSearched(
            {
              name: metadata?.collectibleName ?? metadata?.name ?? tokenId,
              symbol: metadata?.symbol ?? '',
              address: metadata?.address
            },
            searchValueLowercased
          )
        )
      : evmCollectibles;

    const tezosDisplayed: DisplayedCollectible[] = filteredTezosCollectibles.map(asset => ({
      chainKind: TempleChainKind.Tezos,
      slug: asset.slug,
      asset
    }));

    return tezosDisplayed.concat(filteredEvmCollectibles);
  }, [filteredTezosCollectibles, evmCollectibles, searchValue]);

  const navigateToActivity = useCallback(() => navigateToScreen({ screen: ScreensEnum.Activity }), [navigateToScreen]);
  const navigateToManageCollectibles = useCallback(
    () => navigateToScreen({ screen: ScreensEnum.ManageAssets, params: { collectibles: true } }),
    [navigateToScreen]
  );

  const handleCollectiblesScroll = useAnimatedScrollHandler(event => {
    const sectionHeight = collectionsSectionHeight.value;

    if (sectionHeight <= 0) {
      return;
    }

    const scrollOffset = Math.max(0, event.contentOffset.y);
    const collapsedCollectionsHeight = Math.min(sectionHeight, scrollOffset / COLLECTIONS_SCROLL_RATIO);

    collectionsVisibility.value = 1 - collapsedCollectionsHeight / sectionHeight;
  });

  const handleCollectionsLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;

      // Keep the natural height because the animated parent constrains later layout measurements.
      collectionsSectionHeight.value = Math.max(collectionsSectionHeight.value, height);
    },
    [collectionsSectionHeight]
  );

  const renderItemCollections: ListRenderItem<Collection> = useCallback(
    ({ item }) => <CollectionButton item={item} />,
    []
  );

  const collectionsFlatListRef = useRef<FlatList<Collection>>(null);
  // On collections number decrease scroll might not reposition & items remain off-view
  useDidUpdate(() => void collectionsFlatListRef.current?.scrollToOffset({ offset: 0 }), [account.id]);

  return (
    <View style={styles.screen}>
      <HeaderCard hasInsetTop={true} style={styles.headerCard}>
        <View style={styles.accountContainer}>
          <CurrentAccountDropdown isCollectibleScreen />
        </View>

        <Divider size={formatSize(16)} />

        {collections.length > 0 ? (
          <Animated.View style={[styles.collectionsSection, collectionsAnimatedStyle]}>
            <View onLayout={handleCollectionsLayout}>
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
                style={styles.collectionsList}
              />
            </View>
          </Animated.View>
        ) : null}

        <View style={styles.toolbarContainer}>
          <SearchInput
            value={searchValue}
            onChangeText={setSearchValue}
            containerStyle={styles.searchInputContainer}
            placeholder="Search"
          />
          <Divider size={formatSize(16)} />
          <ActionButton iconName={IconNameV2Enum.Clock} onPress={navigateToActivity} />
          <ActionButton iconName={IconNameV2Enum.Slider} onPress={navigateToManageCollectibles} />
        </View>
      </HeaderCard>

      <Animated.View style={[styles.listContainer, listAnimatedStyle]}>
        <CollectiblesList
          collectibles={collectibles}
          showInfo={isShowCollectibleInfo}
          onScroll={handleCollectiblesScroll}
        />
      </Animated.View>
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
