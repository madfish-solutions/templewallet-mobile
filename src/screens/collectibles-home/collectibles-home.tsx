import BottomSheet from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItem, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from 'src/components/account-dropdown/current-account-dropdown';
import { Checkbox } from 'src/components/checkbox/checkbox';
import { Divider } from 'src/components/divider/divider';
import { HeaderCard } from 'src/components/header-card/header-card';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { emptyFn } from 'src/config/general';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadCollectionsActions } from 'src/store/collectons/collections-actions';
import { useCreatedCollectionsSelector } from 'src/store/collectons/collections-selectors';
import { Collection } from 'src/store/collectons/collections-state';
import { setSelectedAccountAction } from 'src/store/wallet/wallet-actions';
import {
  useCollectiblesListSelector,
  useSelectedAccountSelector,
  useVisibleAccountsListSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { formatImgUri } from 'src/utils/image.utils';
import { openUrl } from 'src/utils/linking.util';

import { SocialButton } from '../settings/settings-header/social-button/social-button';
import { useCollectiblesHomeStyles } from './collectibles-home.styles';
import { CollectiblesList } from './collectibles-list/collectibles-list';

enum CollectiblesTypeEnum {
  Owned = 'Owned',
  Created = 'Created',
  OnSale = 'On sale',
  Offers = 'Offers'
}

const SMALL_SOCIAL_ICON_SIZE = formatSize(15);
const OBJKT_COLLECTION_URL = (collectionContract: string) => `https://objkt.com/collection/${collectionContract}`;

export const CollectiblesHome = () => {
  const styles = useCollectiblesHomeStyles();
  const dispatch = useDispatch();
  const collections = useCreatedCollectionsSelector();
  const collectibles = useCollectiblesListSelector();

  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();
  const colors = useColors();
  const windowHeight = useWindowDimensions().height;
  const [headerHeight, setHeaderHeight] = useState(1);
  const [visibleBlockHeight, setVisibleBlockHeight] = useState(1);

  const insets = useSafeAreaInsets();
  const TAB_BAR_HEIGHT = 53 + insets.bottom;

  usePageAnalytic(ScreensEnum.CollectiblesHome);

  useEffect(
    () => void dispatch(loadCollectionsActions.submit(selectedAccount.publicKeyHash)),
    [selectedAccount.publicKeyHash]
  );

  const sheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(
    () => [
      windowHeight - (headerHeight + TAB_BAR_HEIGHT),
      windowHeight - (headerHeight - visibleBlockHeight + TAB_BAR_HEIGHT)
    ],
    [headerHeight, visibleBlockHeight]
  );

  const onValueChange = (value: AccountBaseInterface | undefined) =>
    dispatch(setSelectedAccountAction(value?.publicKeyHash));

  const renderItem: ListRenderItem<Collection> = ({ item }) => {
    const handleCollectionPress = () => openUrl(OBJKT_COLLECTION_URL(item.contract));

    return (
      <TouchableOpacity style={styles.collectionBlock} onPress={handleCollectionPress}>
        {item.logo ? (
          <FastImage style={styles.collection} source={{ uri: formatImgUri(item.logo) }} />
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
        <View style={styles.accountContainer}>
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
            setVisibleBlockHeight(height);
          }}
        >
          <View style={styles.profileContainer}>
            <View style={styles.createProfile}>
              <TouchableIcon name={IconNameEnum.PlusCircle} onPress={() => null} size={formatSize(16)} />
              <Text style={styles.createProfileText}>CREATE PROFILE</Text>
            </View>

            <SocialButton
              iconName={IconNameEnum.Twitter}
              url={''}
              style={styles.socialsIcon}
              color={colors.disabled}
              size={SMALL_SOCIAL_ICON_SIZE}
            />
            <SocialButton
              iconName={IconNameEnum.Website}
              url={''}
              style={styles.socialsIcon}
              color={colors.disabled}
              size={SMALL_SOCIAL_ICON_SIZE}
            />
            <SocialButton
              iconName={IconNameEnum.Github}
              url={''}
              style={styles.socialsIcon}
              color={colors.disabled}
              size={SMALL_SOCIAL_ICON_SIZE}
            />
            <SocialButton
              iconName={IconNameEnum.Discord}
              url={''}
              style={styles.socialsIcon}
              color={colors.disabled}
              size={SMALL_SOCIAL_ICON_SIZE}
            />
          </View>

          {collections.length > 0 && (
            <View style={styles.collectionsHeader}>
              <Text style={styles.collectionsLabel}>Created collections</Text>
              <TouchableOpacity>
                <Text style={styles.disabled}>See All</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.collectionsContainer}>
            <FlatList
              data={collections}
              renderItem={renderItem}
              keyExtractor={collection => `${collection.logo}_${collection.name}`}
              horizontal
              extraData={collections}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        </View>
      </HeaderCard>
      <BottomSheet ref={sheetRef} snapPoints={snapPoints} handleStyle={styles.handleStyle}>
        <View style={styles.nftTypeContainer}>
          <TouchableOpacity style={[styles.NFTType, styles.NFTtypeActive]}>
            <Text style={styles.NFTtypeText}>{CollectiblesTypeEnum.Owned}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.NFTType} disabled>
            <Text style={[styles.NFTtypeText, styles.NFTtypeTextDisabled]}>{CollectiblesTypeEnum.Created}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.NFTType} disabled>
            <Text style={[styles.NFTtypeText, styles.NFTtypeTextDisabled]}>{CollectiblesTypeEnum.OnSale}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.NFTType} disabled>
            <Text style={[styles.NFTtypeText, styles.NFTtypeTextDisabled]}>{CollectiblesTypeEnum.Offers}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.infoContainer}>
          <View style={styles.checkboxContainer}>
            <Checkbox value={false} size={formatSize(16)} strokeWidth={formatSize(2)} onChange={emptyFn}>
              <Divider size={formatSize(5)} />
              <Text style={styles.checkboxText}>Show Info</Text>
            </Checkbox>
          </View>
          <View style={styles.icons}>
            <TouchableIcon
              name={IconNameEnum.SwapSettings}
              onPress={emptyFn}
              size={formatSize(16)}
              disabled
              color={colors.disabled}
            />
            <TouchableIcon name={IconNameEnum.Edit} onPress={emptyFn} size={formatSize(16)} style={styles.centerIcon} />
            <TouchableIcon name={IconNameEnum.Search} onPress={emptyFn} size={formatSize(16)} />
          </View>
        </View>
        <CollectiblesList collectiblesList={collectibles} />
      </BottomSheet>
    </>
  );
};
