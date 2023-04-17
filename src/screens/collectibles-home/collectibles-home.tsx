import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItem,
  PanResponder,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
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
  //const [YValue, setYValue] = useState(340);
  const [expanded, setExpanded] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  //const windowHeight = Dimensions.get('window').height;

  usePageAnalytic(ScreensEnum.CollectiblesHome);

  useEffect(() => void dispatch(loadCollectionsActions.submit(selectedAccount.publicKeyHash)), [selectedAccount]);

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          // Allow pan responder if not expanded or if touch starts from top of the FlatList
          console.log(!expanded, 'is pan responder');
          console.log(gestureState.dy);

          const allowScrollDown = expanded && scrollPosition === 0 && gestureState.dy > 0;
          const allowScrollUp = !expanded;

          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          return allowScrollDown || allowScrollUp;
        },
        onPanResponderGrant: () => {
          pan.extractOffset();
        },
        onPanResponderMove: (e, gestureState) => {
          console.log(gestureState.dy, 'dy1');
          Animated.event([null, { dx: pan.x, dy: pan.y }])(e, gestureState);
        },
        onPanResponderRelease: (_, gestureState) => {
          console.log(gestureState.dy, 'dy');
          if (!expanded && gestureState.dy < -20) {
            console.log('FIRST!!!!!!!!!', expanded);

            setExpanded(true);
            Animated.spring(
              pan, // Auto-multiplexed
              { toValue: { x: 0, y: -190 }, useNativeDriver: true }
            ).start();
          } else if (expanded && gestureState.dy > 20) {
            console.log('SECOND!!!!!!!!!');
            Animated.spring(
              pan, // Auto-multiplexed
              { toValue: { x: 0, y: 190 }, useNativeDriver: true }
            ).start();
            setExpanded(false);
          } else {
            console.log('THIRD!!!!!!!!!');
            Animated.spring(
              pan, // Auto-multiplexed
              { toValue: { x: 0, y: 0 }, useNativeDriver: true }
            ).start();
          }
        }
      }),
    [expanded, scrollPosition]
  );

  console.log(expanded, 'EXPANDED');
  console.log(scrollPosition, 'scroll position');

  const updateScrollPosition = (newPosition: number) => setScrollPosition(newPosition);

  const onValueChange = (value: AccountBaseInterface | undefined) =>
    dispatch(setSelectedAccountAction(value?.publicKeyHash));

  const renderItem: ListRenderItem<Collection> = ({ item }) => (
    <TouchableOpacity style={styles.collectionBlock} onPress={() => openUrl(OBJKT_COLLECTION_URL(item.contract))}>
      {item.logo ? (
        <FastImage style={styles.collection} source={{ uri: formatImgUri(item.logo ?? '') }} />
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
      </HeaderCard>
      <Animated.View
        style={{
          transform: [{ translateY: pan.y }],
          backgroundColor: colors.pageBG
        }}
        {...panResponder.panHandlers}
      >
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
        <CollectiblesList
          collectiblesList={collectibles}
          expanded={expanded}
          setScrollPosition={updateScrollPosition}
        />
      </Animated.View>
    </>
  );
};
