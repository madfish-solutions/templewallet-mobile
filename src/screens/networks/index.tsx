import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
import { AllNetworksOptionId } from 'src/types/networks';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { AllNetworksOptions } from './all-networks-options';

export const Networks = () => {
  const navigateToScreen = useNavigateToScreen();

  usePageAnalytic(ScreensEnum.Networks);

  const handleNetworkSelect = useCallback(
    (network: AllNetworksOptionId) => navigateToScreen({ screen: ScreensEnum.NetworkSettings, params: { network } }),
    [navigateToScreen]
  );

  return (
    <ScreenContainer style={styles.container}>
      <AllNetworksOptions onSelect={handleNetworkSelect} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: formatSize(16)
  }
});
