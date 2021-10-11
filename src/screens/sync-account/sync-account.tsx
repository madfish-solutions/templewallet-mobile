import React from 'react';
import { View, Text } from 'react-native';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { HeaderBackButton } from '../../components/header/header-back-button/header-back-button';
import { useNavigationSetOptions } from '../../components/header/use-navigation-set-options.hook';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreensEnum } from '../../navigator/enums/screens.enum';
import { useNavigation } from '../../navigator/hooks/use-navigation.hook';
import { formatSize } from '../../styles/format-size';
import { useSyncAccountStyles } from './sync-account.styles';

const syncSteps = [
  'Open the extension on desktop',
  'Go to settings > Synchronization',
  'Enter a Password',
  'Scan a QR code'
];

export const SyncAccount = () => {
  const { navigate } = useNavigation();
  const styles = useSyncAccountStyles();

  useNavigationSetOptions(
    {
      headerLeft: () => <HeaderBackButton />
    },
    []
  );

  return (
    <>
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
      <View style={styles.buttonContainer}>
        <ButtonLargePrimary
          marginLeft={formatSize(16)}
          marginRight={formatSize(16)}
          title="Scan QR"
          onPress={() => navigate(ScreensEnum.ScanQrCode)}
        />
        <InsetSubstitute type="bottom" />
      </View>
    </>
  );
};
