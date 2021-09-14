import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Divider } from '../../components/divider/divider';
import { HeaderCard } from '../../components/header-card/header-card';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { SearchInput } from '../../components/search-input/search-input';
import { useFilteredAssetsList } from '../../hooks/use-filtered-assets-list.hook';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { useVisibleCollectiblesListSelector } from '../../store/wallet/wallet-selectors';
import { formatSize } from '../../styles/format-size';
import { useCollectiblesHomeStyles } from './collectibles-home.styles';
import { CollectiblesList } from './collectibles-list/collectibles-list';
import { PromotionCarousel } from './promotion-carousel/promotion-carousel';

export const CollectiblesHome = () => {
  const styles = useCollectiblesHomeStyles();
  const { navigate } = useNavigation();

  const visibleCollectiblesList = useVisibleCollectiblesListSelector();
  const { filteredAssetsList, setSearchValue } = useFilteredAssetsList(visibleCollectiblesList);

  const [isSearchMode] = useState(false);

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

        {isSearchMode ? (
          <>
            <SearchInput placeholder="Type here..." onChangeText={setSearchValue} />
            <Text style={[styles.descriptionText, styles.widthPaddingHorizontal]}>
              Search collectibles by name, sybmol or address.
            </Text>
          </>
        ) : (
          <PromotionCarousel />
        )}
      </HeaderCard>
      <ScreenContainer>
        <CollectiblesList collectiblesList={isSearchMode ? filteredAssetsList : visibleCollectiblesList} />
      </ScreenContainer>
    </>
  );
};
