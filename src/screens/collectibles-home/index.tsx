import React, { memo, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { CurrentAccountDropdown } from 'src/components/account-dropdown/current-account-dropdown';
import { Divider } from 'src/components/divider/divider.tsx';
import { HeaderCard } from 'src/components/header-card/header-card';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { SearchInput } from 'src/components/search-input/search-input';
import { useEtherlinkDataLoading } from 'src/hooks/evm/use-etherlink-data-loading.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { dispatch } from 'src/store';
import { loadCollectionsActions } from 'src/store/collectons/collections-actions';
import { useCreatedCollectionsSelector } from 'src/store/collectons/collections-selectors';
import { useIsShowCollectibleInfoSelector } from 'src/store/settings/settings-selectors';
import { useAccount } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForTezos } from 'src/utils/account.utils.ts';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { ActionButton } from '../wallet/action-button';

import { CollectiblesList } from './collectibles-list';
import { CreatedCollectionsSection } from './created-collections-section';
import { useCollapsibleCollectionsSection } from './hooks/use-collapsible-collections-section';
import { useDisplayedCollectibles } from './hooks/use-displayed-collectibles';
import { useCollectiblesHomeStyles } from './styles';

export const CollectiblesHome = memo(() => {
  const navigateToScreen = useNavigateToScreen();
  usePageAnalytic(ScreensEnum.CollectiblesHome);

  const account = useAccount();
  const collections = useCreatedCollectionsSelector();
  const tezosAddress = getAccountAddressForTezos(account);
  const { collectibles, searchValue, setSearchValue } = useDisplayedCollectibles();
  const {
    animatedStyle: collectionsAnimatedStyle,
    onLayout: handleCollectionsLayout,
    onScroll: handleCollectiblesScroll
  } = useCollapsibleCollectionsSection(account.id);

  useEtherlinkDataLoading();

  const isShowCollectibleInfo = useIsShowCollectibleInfoSelector();

  const styles = useCollectiblesHomeStyles();
  const listTranslateY = useSharedValue<`${number}%`>('100%');

  const listAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: listTranslateY.value }]
  }));

  useEffect(() => {
    listTranslateY.value = withTiming('0%', {
      duration: 500,
      easing: Easing.out(Easing.cubic)
    });
  }, [listTranslateY]);

  useEffect(() => {
    if (tezosAddress) {
      dispatch(loadCollectionsActions.submit(tezosAddress));
    }
  }, [tezosAddress]);

  const navigateToActivity = useCallback(() => navigateToScreen({ screen: ScreensEnum.Activity }), [navigateToScreen]);
  const navigateToManageCollectibles = useCallback(
    () => navigateToScreen({ screen: ScreensEnum.ManageAssets, params: { collectibles: true } }),
    [navigateToScreen]
  );

  return (
    <View style={styles.screen}>
      <HeaderCard hasInsetTop={true} style={styles.headerCard}>
        <View style={styles.accountContainer}>
          <CurrentAccountDropdown isCollectibleScreen />
        </View>

        <Divider size={formatSize(16)} />

        <CreatedCollectionsSection
          accountId={account.id}
          animatedStyle={collectionsAnimatedStyle}
          collections={collections}
          onLayout={handleCollectionsLayout}
        />

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
          key={account.id}
          collectibles={collectibles}
          showInfo={isShowCollectibleInfo}
          onScroll={handleCollectiblesScroll}
        />
      </Animated.View>
    </View>
  );
});
