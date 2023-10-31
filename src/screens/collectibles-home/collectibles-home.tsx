import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { HeaderCard } from 'src/components/header-card/header-card';
import { Icon } from 'src/components/icon/icon';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { useVisibleCollectiblesListSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { useCollectiblesHomeStyles } from './collectibles-home.styles';
import { CollectiblesList } from './collectibles-list/collectibles-list';

export const CollectiblesHome = memo(() => {
  const styles = useCollectiblesHomeStyles();
  const { navigate } = useNavigation();

  usePageAnalytic(ScreensEnum.CollectiblesHome);

  const collectiblesList = useVisibleCollectiblesListSelector();

  return (
    <>
      <HeaderCard hasInsetTop={true} style={styles.headerCard}>
        <View style={[styles.headerContainer, styles.widthPaddingHorizontal]}>
          <TouchableOpacity style={styles.walletNavigationButton} onPress={() => navigate(ScreensEnum.Wallet)}>
            <Text style={styles.walletNavigationButtonText}>To wallet</Text>
            <Icon name={IconNameEnum.ArrowRight} size={formatSize(16)} />
          </TouchableOpacity>
        </View>
      </HeaderCard>

      <CollectiblesList collectiblesList={collectiblesList} />
    </>
  );
});
