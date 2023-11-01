import React from 'react';
import { View, Text } from 'react-native';

import { ButtonLargePrimary } from '../../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../../components/divider/divider';
import { HeaderBackButton } from '../../../components/header/header-back-button/header-back-button';
import { useNavigationSetOptions } from '../../../components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from '../../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../../components/screen-container/screen-container';
import { ScreensEnum } from '../../../navigator/enums/screens.enum';
import { useNavigation } from '../../../navigator/hooks/use-navigation.hook';
import { usePageAnalytic } from '../../../utils/analytics/use-analytics.hook';

import { SyncInstructionsSelectors } from './sync-instructions.selectors';
import { useSyncInstructionsStyles } from './sync-instructions.styles';

const syncSteps = [
  'Open the extension on desktop',
  'Go to settings > Synchronization',
  'Enter a Password',
  'Scan a QR code'
];

export const SyncInstructions = () => {
  const { navigate } = useNavigation();
  const styles = useSyncInstructionsStyles();

  usePageAnalytic(ScreensEnum.SyncInstructions);

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />
    },
    []
  );

  return (
    <ScreenContainer isFullScreenMode={true}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Steps to sync with Temple Wallet extension</Text>
      </View>
      <View>
        {syncSteps.map((s, id) => (
          <Text style={styles.text} key={s}>
            {id + 1}. {s}
          </Text>
        ))}
      </View>
      <Divider />
      <View style={styles.buttonContainer}>
        <ButtonLargePrimary
          title="Scan QR"
          onPress={() => navigate(ScreensEnum.ScanQrCode)}
          testID={SyncInstructionsSelectors.scanQRButton}
        />
        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
