import React, { useEffect, useMemo } from 'react';
import { FlatList, ListRenderItem, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from 'src/components/account-dropdown/current-account-dropdown';
import { HeaderCard } from 'src/components/header-card/header-card';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { discordUrl, twitterUrl } from 'src/config/socials';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadCollectionsActions } from 'src/store/collectons/collections-actions';
import { useCollectionsSelector } from 'src/store/collectons/collections-selectors';
import { Collection } from 'src/store/collectons/collections-state';
import { setSelectedAccountAction } from 'src/store/wallet/wallet-actions';
import {
  useSelectedAccountSelector,
  useVisibleAccountsListSelector,
  useVisibleCollectiblesListSelector
} from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { filterUnique } from 'src/utils/array.utils';
import { formatImgUri } from 'src/utils/image.utils';
import { openUrl } from 'src/utils/linking.util';

import { SocialButton } from '../settings/settings-header/social-button/social-button';
import { useCollectiblesHomeStyles } from './collectibles-home.styles';

const SMALL_SOCIAL_ICON_SIZE = formatSize(15);
const OBJKT_COLLECTION_URL = (collectionContract: string) => `https://objkt.com/collection/${collectionContract}`;

export const CollectiblesHome = () => {
  const styles = useCollectiblesHomeStyles();
  const dispatch = useDispatch();
  const collections = useCollectionsSelector();

  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();
  const colors = useColors();

  usePageAnalytic(ScreensEnum.CollectiblesHome);

  const visibleCollectiblesList = useVisibleCollectiblesListSelector();

  const collectiblesFromCollections = useMemo(
    () =>
      filterUnique(
        visibleCollectiblesList.filter(collectible => collectible.id !== 0).map(collection => collection.address)
      ),

    [visibleCollectiblesList]
  );

  useEffect(() => void dispatch(loadCollectionsActions.submit(collectiblesFromCollections)), [selectedAccount]);

  const onValueChange = (value: AccountBaseInterface | undefined) =>
    dispatch(setSelectedAccountAction(value?.publicKeyHash));

  const renderItem: ListRenderItem<Collection> = ({ item }) => (
    <TouchableOpacity style={styles.collectionBlock} onPress={() => openUrl(OBJKT_COLLECTION_URL(item.contract))}>
      <FastImage style={styles.collection} source={{ uri: formatImgUri(item.logo) }} />

      <Text numberOfLines={1} style={styles.collectionName}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderCard hasInsetTop={true} style={styles.headerCard}>
        <View style={styles.accountContainer}>
          <CurrentAccountDropdown
            value={selectedAccount}
            list={visibleAccounts}
            onValueChange={onValueChange}
            isCollectibleScreen
          />
        </View>
        <View style={styles.profileContainer}>
          <View style={styles.createProfile}>
            <TouchableIcon name={IconNameEnum.PlusCircle} onPress={() => null} size={formatSize(16)} />
            <Text style={styles.createProfileText}>CREATE PROFILE</Text>
          </View>

          <SocialButton
            iconName={IconNameEnum.Twitter}
            url={twitterUrl}
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
            url={discordUrl}
            style={styles.socialsIcon}
            color={colors.disabled}
            size={SMALL_SOCIAL_ICON_SIZE}
          />
        </View>

        <View style={styles.collectionsHeader}>
          <Text style={styles.collectionsLabel}>Created Collections</Text>
          <TouchableOpacity>
            <Text style={styles.disabled}>See All</Text>
          </TouchableOpacity>
        </View>
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
      </HeaderCard>
    </>
  );
};
