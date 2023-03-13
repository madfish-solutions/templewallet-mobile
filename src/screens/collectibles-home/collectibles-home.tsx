import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from 'src/components/divider/divider';
import { HeaderCard } from 'src/components/header-card/header-card';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { SearchInput } from 'src/components/search-input/search-input';
import { useFilteredAssetsList } from 'src/hooks/use-filtered-assets-list.hook';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useVisibleCollectiblesListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { useCollectiblesHomeStyles } from './collectibles-home.styles';
import { CollectiblesList } from './collectibles-list/collectibles-list';

export const CollectiblesHome = () => {
  const styles = useCollectiblesHomeStyles();
  const { navigate } = useNavigation();

  usePageAnalytic(ScreensEnum.CollectiblesHome);

  const visibleCollectiblesList = useVisibleCollectiblesListSelector();
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(visibleCollectiblesList);

  const [isSearchMode] = useState(false);

  const collectiblesList: typeof visibleCollectiblesList = isSearchMode ? filteredAssetsList : visibleCollectiblesList;

  return (
    <>
      <HeaderCard hasInsetTop={true} style={styles.headerCard}>
        <View style={[styles.headerContainer, styles.widthPaddingHorizontal]}>
          <View style={styles.actionsContainer}>
            {/*<TouchableIcon*/}
            {/*  name={isSearchMode ? IconNameEnum.XSearch : IconNameEnum.Search}*/}
            {/*  onPress={() => setIsSearchMode(!isSearchMode)}*/}
            {/*/>*/}
            {/*<Divider size={formatSize(16)} />*/}
            {/*<TouchableIcon name={IconNameEnum.Hummer} disabled={true} color={colors.disabled} onPress={emptyFn} />*/}
          </View>

          <TouchableOpacity style={styles.walletNavigationButton} onPress={() => navigate(ScreensEnum.Wallet)}>
            <Text style={styles.walletNavigationButtonText}>To wallet</Text>
            <Icon name={IconNameEnum.ArrowRight} size={formatSize(16)} />
          </TouchableOpacity>
        </View>

        <Divider />

        <SearchInput placeholder="Type here..." onChangeText={setSearchValue} />

        <Text style={[styles.descriptionText, styles.widthPaddingHorizontal]}>
          Search collectibles by name, sybmol or address.
        </Text>
      </HeaderCard>

      <CollectiblesList collectiblesList={collectiblesList} />
    </>
  );
};
