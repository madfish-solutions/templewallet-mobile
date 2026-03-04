import React, { memo } from 'react';
import { View, Text } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigateToScreen } from 'src/navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';

import { SyncInstructionsSelectors } from './sync-instructions.selectors';
import { useSyncInstructionsStyles } from './sync-instructions.styles';

const syncSteps = [
  'Open the extension on desktop',
  'Go to Settings > Synchronization',
  'Enter a Password',
  'Scan a QR code'
];

interface Props {
  onBackPress: EmptyFn;
}

export const SyncInstructions = memo<Props>(({ onBackPress }) => {
  const navigateToScreen = useNavigateToScreen();
  const styles = useSyncInstructionsStyles();

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Sync with Extension Wallet" /> }, []);

  usePageAnalytic(ModalsEnum.SyncInstructions);

  return (
    <>
      <ScreenContainer isFullScreenMode={true} contentContainerStyle={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Steps to sync with Temple Wallet extension</Text>
        </View>
        <View style={styles.stepsContainer}>
          {syncSteps.map((step, id) => (
            <View key={step} style={styles.stepContainer}>
              <Text style={styles.text}>
                {id + 1}. {step}
              </Text>
            </View>
          ))}
        </View>
      </ScreenContainer>

      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary title="Back" onPress={onBackPress} testID={SyncInstructionsSelectors.backButton} />
        <ButtonLargePrimary
          title="Scan QR"
          onPress={() => navigateToScreen({ screen: ScreensEnum.ScanQrCode })}
          testID={SyncInstructionsSelectors.scanQRButton}
        />
      </ModalButtonsFloatingContainer>
    </>
  );
});
