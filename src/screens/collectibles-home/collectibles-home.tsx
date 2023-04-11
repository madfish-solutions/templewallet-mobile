import React, { useEffect, useState } from 'react';
import { FlatList, ListRenderItem, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';

import { CurrentAccountDropdown } from 'src/components/account-dropdown/current-account-dropdown';
import { HeaderCard } from 'src/components/header-card/header-card';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { AccountBaseInterface } from 'src/interfaces/account.interface';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { loadCollectionsActions } from 'src/store/collectons/collections-actions';
import { useCreatedCollectionsSelector } from 'src/store/collectons/collections-selectors';
import { Collection } from 'src/store/collectons/collections-state';
import { setSelectedAccountAction } from 'src/store/wallet/wallet-actions';
import { useSelectedAccountSelector, useVisibleAccountsListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { formatImgUri } from 'src/utils/image.utils';
import { openUrl } from 'src/utils/linking.util';

import { SocialButton } from '../settings/settings-header/social-button/social-button';
import { useCollectiblesHomeStyles } from './collectibles-home.styles';

const SMALL_SOCIAL_ICON_SIZE = formatSize(15);
const OBJKT_COLLECTION_URL = (collectionContract: string) => `https://objkt.com/collection/${collectionContract}`;

export const CollectiblesHome = () => {
  const styles = useCollectiblesHomeStyles();
  const dispatch = useDispatch();
  const collections = useCreatedCollectionsSelector();
  const [isImageBroken, setIsImageBroken] = useState(false);

  const selectedAccount = useSelectedAccountSelector();
  const visibleAccounts = useVisibleAccountsListSelector();
  const colors = useColors();

  usePageAnalytic(ScreensEnum.CollectiblesHome);

  useEffect(() => void dispatch(loadCollectionsActions.submit(selectedAccount.publicKeyHash)), [selectedAccount]);

  const onValueChange = (value: AccountBaseInterface | undefined) =>
    dispatch(setSelectedAccountAction(value?.publicKeyHash));

  const renderItem: ListRenderItem<Collection> = ({ item }) => (
    <TouchableOpacity style={styles.collectionBlock} onPress={() => openUrl(OBJKT_COLLECTION_URL(item.contract))}>
      {isImageBroken ? (
        <View style={styles.collection}>
          <Icon name={IconNameEnum.NFTCollection} size={formatSize(31)} />
        </View>
      ) : (
        <FastImage
          style={styles.collection}
          source={{ uri: formatImgUri(item.logo ?? '') }}
          onError={() => setIsImageBroken(true)}
        />
      )}

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
            <Text style={styles.collectionsLabel}>Created Collections</Text>
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
      </HeaderCard>
    </>
  );
};
