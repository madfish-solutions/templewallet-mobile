import React from 'react';
import { View } from 'react-native';
import { appDetailsSettings } from 'react-native-android-open-settings';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { ButtonsFloatingContainer } from '../../components/button/buttons-floating-container/buttons-floating-container';
import { Disclaimer } from '../../components/disclaimer/disclaimer';
import { Divider } from '../../components/divider/divider';
import { isAndroid } from '../../config/system';
import { formatSize } from '../../styles/format-size';
import { openUrl } from '../../utils/linking';
import { useScanQrCodeStyles } from './scan-qr-code.styles';

export const EmptyQrCode = () => {
  const styles = useScanQrCodeStyles();

  const handlePress = () => (isAndroid ? appDetailsSettings() : openUrl('App-Prefs:Security'));

  return (
    <View style={styles.emptyScreen}>
      <View style={styles.disclaimer}>
        <Disclaimer texts={['There is no access to the Camera.', 'Please, give access in the phone Setting page.']} />
        <Divider size={formatSize(16)} />
      </View>
      <ButtonsFloatingContainer>
        <ButtonLargePrimary title="Open Settings" onPress={handlePress} />
      </ButtonsFloatingContainer>
    </View>
  );
};
