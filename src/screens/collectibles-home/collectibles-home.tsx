import BottomSheet from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ListRenderItem,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets, initialWindowMetrics } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from 'src/components/account-dropdown/current-account-dropdown';
import { HeaderCard } from 'src/components/header-card/header-card';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { emptyFn } from 'src/config/general';
import { isAndroid } from 'src/config/system';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { loadCollectionsActions } from 'src/store/collectons/collections-actions';
import { useCreatedCollectionsSelector } from 'src/store/collectons/collections-selectors';
import { Collection } from 'src/store/collectons/collections-state';
import { loadTzProfileIfoAction, setSelectedAccountAction } from 'src/store/wallet/wallet-actions';
import { useSelectedAccountSelector, useVisibleAccountsListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { copyStringToClipboard } from 'src/utils/clipboard.utils';
import { conditionalStyle } from 'src/utils/conditional-style';
import { formatImgUri } from 'src/utils/image.utils';
import { isDefined } from 'src/utils/is-defined';
import { openUrl } from 'src/utils/linking.util';

import { CheckboxIcon } from '../../components/checkbox-icon/checkbox-icon';
import { useCollectiblesWithFullData } from '../../hooks/use-collectibles-with-full-data.hook';
import { useCollectibleDetailsLoadingSelector } from '../../store/collectibles/collectibles-selectors';
import { switchIsShowCollectibleInfoAction } from '../../store/settings/settings-actions';
import { useIsShowCollectibleInfoSelector } from '../../store/settings/settings-selectors';
import { SocialButton } from '../settings/settings-header/social-button/social-button';
import { useCollectiblesHomeStyles } from './collectibles-home.styles';
import { CollectiblesList } from './collectibles-list/collectibles-list';

interface SocialLinksInterface {
  url: string | undefined;
  icon: IconNameEnum;
}

const SMALL_SOCIAL_ICON_SIZE = formatSize(15);

export const CollectiblesHome = () => {
  const { navigate } = useNavigation();
  const dispatch = useDispatch();

  const collections = useCreatedCollectionsSelector();
  const collectibles = useCollectiblesWithFullData();
  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();
  const isShowCollectibleInfo = useIsShowCollectibleInfoSelector();
  const isDetailsLoading = useCollectibleDetailsLoadingSelector();

  const styles = useCollectiblesHomeStyles();
  const colors = useColors();
  const { height: windowHeightDimensions, scale } = useWindowDimensions();

  const [headerHeight, setHeaderHeight] = useState(1);
  const [visibleBlockHeight, setVisibleBlockHeight] = useState(1);

  const iosSafeArea = useSafeAreaInsets();

  const androidSafeAreaValue =
    isDefined(initialWindowMetrics) && initialWindowMetrics.insets.bottom > 0
      ? initialWindowMetrics.insets.bottom + initialWindowMetrics.insets.top
      : 0;

  // LOGGER
  useEffect(() => {
    console.log('scale', scale);
    console.log('windowHeightDimensions', windowHeightDimensions);
    console.log('visibleBlockHeight', visibleBlockHeight);
    console.log('headerHeight', headerHeight);
    console.log('iosSafeArea', iosSafeArea);
    console.log(androidSafeAreaValue, JSON.stringify(initialWindowMetrics, null, 2));
  }, [initialWindowMetrics, windowHeightDimensions, headerHeight, scale, iosSafeArea]);

  const openTzProfiles = () => openUrl('https://tzprofiles.com/');

  usePageAnalytic(ScreensEnum.CollectiblesHome);

  useEffect(() => {
    dispatch(loadCollectionsActions.submit(selectedAccount.publicKeyHash));
    dispatch(loadTzProfileIfoAction.submit());
  }, [selectedAccount.publicKeyHash]);

  const sheetRef = useRef<BottomSheet>(null);

  const { alias, twitter, discord, website, github } = selectedAccount.tzProfile || {};

  const socialLinks: SocialLinksInterface[] = [
    { url: twitter, icon: IconNameEnum.Twitter },
    { url: discord, icon: IconNameEnum.Discord },
    { url: website, icon: IconNameEnum.Website },
    { url: github, icon: IconNameEnum.Github }
  ].sort((a, b) => {
    if (isDefined(a.url) && isDefined(b.url)) {
      return 0;
    }
    if (!isDefined(a.url)) {
      return 1;
    }
    if (!isDefined(b.url)) {
      return -1;
    }

    return 1;
  });

  const androidSafeArea = isDefined(initialWindowMetrics)
    ? initialWindowMetrics.insets.top + initialWindowMetrics.insets.bottom
    : 0;
  const globalHeight = isDefined(initialWindowMetrics) ? initialWindowMetrics.frame.height : windowHeightDimensions;
  const applicationHeight = isAndroid ? globalHeight - androidSafeArea : globalHeight - iosSafeArea.bottom;
  const topOffset = 78;

  console.log('TEST', globalHeight, applicationHeight, topOffset);

  const snapPoints = useMemo(
    () => [applicationHeight - headerHeight, applicationHeight - 18],
    [headerHeight, topOffset]
  );

  useEffect(() => void console.log(snapPoints), [snapPoints]);

  const onValueChange = (value: AccountBaseInterface | undefined) =>
    dispatch(setSelectedAccountAction(value?.publicKeyHash));

  const handleSwitchShowInfo = () => void dispatch(switchIsShowCollectibleInfoAction());

  const renderItemSocialLinks: ListRenderItem<SocialLinksInterface> = ({ item }) => (
    <SocialButton
      iconName={item.icon}
      url={item.url ?? ''}
      style={[styles.socialsIcon, conditionalStyle(!isDefined(item.url), styles.socialIconsBgColor)]}
      color={isDefined(item.url) ? colors.orange : colors.disabled}
      size={SMALL_SOCIAL_ICON_SIZE}
      onPress={item.url === discord ? () => copyStringToClipboard(item.url) : undefined}
    />
  );

  const renderItemCollections: ListRenderItem<Collection> = ({ item }) => {
    const handleCollectionPress = () =>
      navigate(ScreensEnum.Collection, {
        collectionContract: item.contract,
        collectionName: item.name,
        type: item.type,
        galleryId: item.galleryId
      });

    return (
      <TouchableOpacity style={styles.collectionBlock} onPress={handleCollectionPress}>
        {item.logo ? (
          <FastImage source={{ uri: formatImgUri(item.logo) }} style={styles.collection} />
        ) : (
          <View style={[styles.collection, styles.brokenImage]}>
            <Icon name={IconNameEnum.NFTCollection} size={formatSize(31)} />
          </View>
        )}

        <Text numberOfLines={1} style={styles.collectionName}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

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
        <View
          onLayout={event => {
            const { height } = event.nativeEvent.layout;
            setVisibleBlockHeight(height);
          }}
          style={styles.accountContainer}
        >
          <CurrentAccountDropdown
            value={selectedAccount}
            list={visibleAccounts}
            onValueChange={onValueChange}
            isCollectibleScreen
          />
        </View>

        <View
          onLayout={event => {
            const { height } = event.nativeEvent.layout;
            // setVisibleBlockHeight(height);
          }}
          style={styles.profileContainer}
        >
          <View style={styles.profileActions}>
            {isDefined(alias) ? (
              <TouchableOpacity onPress={openTzProfiles} style={styles.profileActionButton}>
                <Icon name={IconNameEnum.EditNew} size={formatSize(24)} />
                <Text style={styles.profileText}>EDIT PROFILE</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={openTzProfiles} style={styles.profileActionButton}>
                <Icon name={IconNameEnum.PlusCircleNew} size={formatSize(24)} />
                <Text style={styles.profileText}>CREATE PROFILE</Text>
              </TouchableOpacity>
            )}

            <FlatList data={socialLinks} renderItem={renderItemSocialLinks} horizontal={true} />
          </View>

          {collections.length > 0 && (
            <View style={styles.collectionsHeader}>
              <Text style={styles.collectionsLabel}>Created collections</Text>

              <TouchableOpacity>
                <Text style={styles.buttonDisabled}>See All</Text>
              </TouchableOpacity>
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
            <TouchableIcon name={IconNameEnum.SwapSettingsNew} onPress={emptyFn} disabled color={colors.disabled} />
            <TouchableIcon name={IconNameEnum.EditNew} onPress={emptyFn} style={styles.offsetBetween} />
            <TouchableIcon name={IconNameEnum.SearchNew} onPress={emptyFn} />
          </View>
        </View>

        {isDetailsLoading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <CollectiblesList collectibles={collectibles} isShowInfo={isShowCollectibleInfo} />
        )}
      </BottomSheet>
    </>
  );
};
