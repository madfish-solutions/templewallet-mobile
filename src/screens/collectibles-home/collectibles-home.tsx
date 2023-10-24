import BottomSheet from '@gorhom/bottom-sheet';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ListRenderItem, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from 'src/components/account-dropdown/current-account-dropdown';
import { CheckboxIcon } from 'src/components/checkbox-icon/checkbox-icon';
import { HeaderCard } from 'src/components/header-card/header-card';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { ImageWithIndicator } from 'src/components/image';
import { Search } from 'src/components/search/search';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { loadCollectionsActions } from 'src/store/collectons/collections-actions';
import { useCreatedCollectionsSelector } from 'src/store/collectons/collections-selectors';
import { Collection } from 'src/store/collectons/collections-state';
import { switchIsShowCollectibleInfoAction } from 'src/store/settings/settings-actions';
import { useIsShowCollectibleInfoSelector } from 'src/store/settings/settings-selectors';
import { useCurrentAccountPkhSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { useCurrentAccountCollectibles } from 'src/utils/assets/hooks';
import { useDidUpdate } from 'src/utils/hooks';
import { formatObjktLogoUri } from 'src/utils/image.utils';

import { CollectiblesList } from './collectibles-list';
import { useCollectiblesHomeStyles, useCollectionButtonStyles } from './styles';
import { TzProfileView } from './tz-profile';

export const CollectiblesHome = memo(() => {
  const { navigate } = useNavigation();
  usePageAnalytic(ScreensEnum.CollectiblesHome);

  const dispatch = useDispatch();

  const collections = useCreatedCollectionsSelector();
  const collectibles = useCurrentAccountCollectibles(true);
  const accountPkh = useCurrentAccountPkhSelector();
  const isShowCollectibleInfo = useIsShowCollectibleInfoSelector();

  const styles = useCollectiblesHomeStyles();

  const [screenHeight, setScreenHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [profileHeight, setProfileHeight] = useState(0);

  const snapPoints = useMemo(() => {
    const firstSnapPoint = screenHeight - headerHeight;
    if (firstSnapPoint < 1) {
      return null;
    }

    const secondSnapPoint = firstSnapPoint + profileHeight;

    return firstSnapPoint === secondSnapPoint ? [firstSnapPoint] : [firstSnapPoint, secondSnapPoint];
  }, [screenHeight, headerHeight, profileHeight]);

  useEffect(() => {
    dispatch(loadCollectionsActions.submit(accountPkh));
  }, [accountPkh, dispatch]);

  const { setSearchValue, filteredAssetsList } = useFilteredAssetsList(collectibles);

  const handleSwitchShowInfo = () => void dispatch(switchIsShowCollectibleInfoAction());

  const renderItemCollections: ListRenderItem<Collection> = useCallback(
    ({ item }) => <CollectionButton item={item} />,
    []
  );

  const collectionsFlatListRef = useRef<FlatList<Collection>>(null);
  // On collections number decrease scroll might not reposition & items remain off-view
  useDidUpdate(() => void collectionsFlatListRef.current?.scrollToOffset({ offset: 0 }), [accountPkh]);

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
          <TzProfileView accountPkh={accountPkh} />

          {collections.length > 0 ? (
            <>
              <View style={styles.collectionsHeader}>
                <Text style={styles.collectionsLabel}>Created collections</Text>
              </View>

              <FlatList
                ref={collectionsFlatListRef}
                data={collections}
                renderItem={renderItemCollections}
                keyExtractor={({ type, contract, galleryId }) => `${type}/${contract}/${galleryId}`}
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

          <CollectiblesList collectibles={filteredAssetsList} isShowInfo={isShowCollectibleInfo} />
        </BottomSheet>
      ) : null}
    </View>
  );
});

interface CollectionLogoProps {
  item: Collection;
}

const CollectionButton = memo<CollectionLogoProps>(({ item }) => {
  const { navigate } = useNavigation();

  const handleCollectionPress = () =>
    navigate(ScreensEnum.Collection, {
      collectionContract: item.contract,
      collectionName: item.name,
      type: item.type,
      galleryId: item.galleryId
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
