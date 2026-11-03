import React, { useCallback } from 'react';
import { Text, View } from 'react-native';

import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { IconV2 } from 'src/components/icon-v2';
import { IconNameV2Enum } from 'src/components/icon-v2/icon-name.enum';
import { TouchableWithAnalytics } from 'src/components/touchable-with-analytics';
import { useBridgeAccountAddresses } from 'src/hooks/use-bridge-account-addresses.hook';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useNavigateToModal } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { SwapFormSelectors } from '../swap-form.selectors';

import { useBridgeBannerStyles } from './bridge-banner.styles';

export const BridgeBanner = () => {
  const styles = useBridgeBannerStyles();
  const colors = useColors();
  const navigateToModal = useNavigateToModal();
  const bridgeAddresses = useBridgeAccountAddresses();

  const handlePress = useCallback(() => navigateToModal(ModalsEnum.Bridge), [navigateToModal]);

  if (!bridgeAddresses) {
    return null;
  }

  return (
    <TouchableWithAnalytics style={styles.container} onPress={handlePress} testID={SwapFormSelectors.bridgeBanner}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <CryptoLogo name={CryptoLogoNameEnum.Etherlink} size={formatSize(20)} internalSize={formatSize(20)} />
        </View>
        <View style={styles.texts}>
          <Text style={styles.title}>Bridge Tezos to Etherlink</Text>
          <Text style={styles.description}>Move assets via official Tezos bridge</Text>
        </View>
      </View>
      <IconV2 name={IconNameV2Enum.ChevronRight} size={24} color={colors.orange} />
    </TouchableWithAnalytics>
  );
};
