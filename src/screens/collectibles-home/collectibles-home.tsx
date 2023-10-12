import BottomSheet from '@gorhom/bottom-sheet';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import { isTablet } from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from 'src/components/account-dropdown/current-account-dropdown';
import { CheckboxIcon } from 'src/components/checkbox-icon/checkbox-icon';
import { HeaderCard } from 'src/components/header-card/header-card';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { Search } from 'src/components/search/search';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useCollectibleDetailsLoadingSelector } from 'src/store/collectibles/collectibles-selectors';
import { loadCollectionsActions } from 'src/store/collectons/collections-actions';
import { useCreatedCollectionsSelector } from 'src/store/collectons/collections-selectors';
import { Collection } from 'src/store/collectons/collections-state';
import { switchIsShowCollectibleInfoAction } from 'src/store/settings/settings-actions';
import { useIsShowCollectibleInfoSelector } from 'src/store/settings/settings-selectors';
import { loadTzProfileIfoAction } from 'src/store/wallet/wallet-actions';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { useEnabledAccountCollectibles } from 'src/utils/assets/hooks';
import { formatImgUri } from 'src/utils/image.utils';

import { CollectiblesList } from './collectibles-list';
import { useCollectiblesHomeStyles } from './styles';
import { TzProfileView } from './tz-profile';

export const CollectiblesHome = memo(() => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const collections = useCreatedCollectionsSelector();
  const collectibles = useEnabledAccountCollectibles();
  const accountPkh = useCurrentAccountPkhSelector();
  const isShowCollectibleInfo = useIsShowCollectibleInfoSelector();
  const areDetailsLoading = useCollectibleDetailsLoadingSelector();

  const styles = useCollectiblesHomeStyles();
  const { height: windowHeight } = useWindowDimensions();

  const [headerHeight, setHeaderHeight] = useState(1);
  const [visibleBlockHeight, setVisibleBlockHeight] = useState(1);

  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => {
    const TAB_BAR_HEIGHT = isTablet() ? 0 : formatSize(48) + insets.bottom;
    const MARGIN_BETWEEN_COMPONENTS = formatSize(16);

    const statusBar = isTablet() ? StatusBar.currentHeight ?? 0 : 0;

    const firstSnapPoint = windowHeight - (headerHeight + TAB_BAR_HEIGHT + statusBar);

    return [firstSnapPoint, firstSnapPoint + visibleBlockHeight + MARGIN_BETWEEN_COMPONENTS];
  }, [headerHeight, visibleBlockHeight, windowHeight, insets.bottom, StatusBar.currentHeight]);

  usePageAnalytic(ScreensEnum.CollectiblesHome);

  useEffect(() => {
    dispatch(loadCollectionsActions.submit(accountPkh));
    dispatch(loadTzProfileIfoAction.submit());
  }, [accountPkh, dispatch]);

  const sheetRef = useRef<BottomSheet>(null);

  const { setSearchValue, filteredAssetsList } = useFilteredAssetsList(collectibles);

  const handleSwitchShowInfo = () => void dispatch(switchIsShowCollectibleInfoAction());

  const renderItemCollections: ListRenderItem<Collection> = useCallback(
    ({ item }) => <CollectionLogo item={item} />,
    []
  );

  return (
    <>
      <HeaderCard
        hasInsetTop={true}
        style={styles.headerCard}
        onLayout={event => {
          const { height } = event.nativeEvent.layout;
          setHeaderHeight(height);
        }}
      >
        <View style={styles.accountContainer}>
          <CurrentAccountDropdown isCollectibleScreen />
        </View>

        <View
          onLayout={event => {
            const { height } = event.nativeEvent.layout;
            setVisibleBlockHeight(height);
          }}
          style={styles.profileContainer}
        >
          <TzProfileView accountPkh={accountPkh} />

          {collections.length > 0 && (
            <View style={styles.collectionsHeader}>
              <Text style={styles.collectionsLabel}>Created collections</Text>
            </View>
          )}

          <FlatList
            data={collections}
            renderItem={renderItemCollections}
            keyExtractor={(collection, id) => `${collection.logo}_${collection.name}+${id}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.collectionsContainer}
          />
        </View>
      </HeaderCard>

      <BottomSheet
        ref={sheetRef}
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
                onPress={() => navigate(ScreensEnum.ManageAssets, { collectibles: true })}
              />
            </Search>
          </View>
        </View>

        {areDetailsLoading && !collectibles.length ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <CollectiblesList collectibles={filteredAssetsList} isShowInfo={isShowCollectibleInfo} />
        )}
      </BottomSheet>
    </>
  );
});

interface CollectionLogoProps {
  item: Collection;
}

const CollectionLogo = memo<CollectionLogoProps>(({ item }) => {
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsloading] = useState(false);

  const { navigate } = useNavigation();

  const handleCollectionPress = () =>
    navigate(ScreensEnum.Collection, {
      collectionContract: item.contract,
      collectionName: item.name,
      type: item.type,
      galleryId: item.galleryId
    });

  const styles = useCollectiblesHomeStyles();

  return (
    <>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity style={styles.collectionBlock} onPress={handleCollectionPress}>
          {item.logo && !isError ? (
            <FastImage
              source={{ uri: formatImgUri(item.logo) }}
              style={styles.collection}
              onError={() => setIsError(true)}
              onLoadStart={() => setIsloading(true)}
              onLoadEnd={() => setIsloading(false)}
            />
          ) : (
            <View style={[styles.collection, styles.brokenImage]}>
              <Icon name={IconNameEnum.NFTCollection} size={formatSize(31)} />
            </View>
          )}

          <Text numberOfLines={1} style={styles.collectionName}>
            {item.name}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
});
