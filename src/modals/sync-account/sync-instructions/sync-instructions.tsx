import React, { memo } from 'react';
import { View, Text } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { ButtonsFloatingContainer } from 'src/components/button/buttons-floating-container/buttons-floating-container';
import { Divider } from 'src/components/divider/divider';
import { HeaderTitle } from 'src/components/header/header-title/header-title';
import { useNavigationSetOptions } from 'src/components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { formatSize } from 'src/styles/format-size';
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
  const { navigate } = useNavigation();
  const styles = useSyncInstructionsStyles();

  useNavigationSetOptions({ headerTitle: () => <HeaderTitle title="Sync with Extension Wallet" /> }, []);

  usePageAnalytic(ModalsEnum.SyncInstructions);

  return (
    <>
      <View style={styles.container}>
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
      </View>

      <ButtonsFloatingContainer>
        <ButtonsContainer style={styles.buttonsContainer}>
          <View style={styles.flex}>
            <ButtonLargeSecondary title="Back" onPress={onBackPress} testID={SyncInstructionsSelectors.backButton} />
          </View>
          <Divider size={formatSize(15)} />
          <View style={styles.flex}>
            <ButtonLargePrimary
              title="Scan QR"
              onPress={() => navigate(ScreensEnum.ScanQrCode)}
              testID={SyncInstructionsSelectors.scanQRButton}
            />
          </View>
        </ButtonsContainer>
        <InsetSubstitute type="bottom" />
      </ButtonsFloatingContainer>
    </>
  );
});
