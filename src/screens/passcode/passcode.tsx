import React, { useCallback } from 'react';
import { Linking, Text, View } from 'react-native';
import { generalSettings } from 'react-native-android-open-settings';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { isIOS } from '../../config/system';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { usePassCodeStyles } from './passcode.styles';

export const PassCode = () => {
  const styles = usePassCodeStyles();
  const colors = useColors();

  const handleSettings = useCallback(() => {
    isIOS ? Linking.openURL('App-Prefs:Bluetooth') : generalSettings();
  }, []);

  return (
    <ScreenContainer style={styles.root} isFullScreenMode={true}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name={IconNameEnum.Lock} size={formatSize(64)} color={colors.orange} />
        </View>
        <Divider />
        <View>
          <Text style={styles.header}>Device-level passcode is crucial for application security.</Text>
          <Divider />
          <Text style={styles.description}>
            If the passcode is not installed anyone can unlock the device. It becomes very dangerous if someone steals
            the device with no passcode.
          </Text>
          <Divider />
          <Text style={styles.guide}>
            The app enforces a minimum device-access-security policy, such as requiring the user to set a device
            passcode!
          </Text>
        </View>
      </View>
      <View>
        <ButtonLargePrimary title="Go to Settings" onPress={handleSettings} />
        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
