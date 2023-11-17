import React from 'react';
import { Text, View } from 'react-native';
import RNExitApp from 'react-native-exit-app';

import { ButtonLargePrimary } from '../../components/button/button-large/button-large-primary/button-large-primary';
import { Divider } from '../../components/divider/divider';
import { Icon } from '../../components/icon/icon';
import { IconNameEnum } from '../../components/icon/icon-name.enum';
import { InsetSubstitute } from '../../components/inset-substitute/inset-substitute';
import { ScreenContainer } from '../../components/screen-container/screen-container';
import { OverlayEnum } from '../../navigator/enums/overlay.enum';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { usePageAnalytic } from '../../utils/analytics/use-analytics.hook';

import { useAppCheckWarningStyles } from './app-check-warning.styles';

export const AppCheckWarning = () => {
  const styles = useAppCheckWarningStyles();
  const colors = useColors();

  usePageAnalytic(OverlayEnum.AppCheckWarning);

  return (
    <ScreenContainer style={styles.root} isFullScreenMode={true}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Icon name={IconNameEnum.AlertTriangle} size={formatSize(64)} color={colors.orange} />
        </View>
        <Divider />
        <View>
          <Text style={styles.header}>Warning!</Text>
          <Divider />
          <Text style={styles.description}>
            We detected that something wrong with your Temple Wallet app. It has been modified and might be unsafe.
            Please, re-install the app. If it doesn't help, contact a technical service to check your phone on malicious
            software.
          </Text>
        </View>
      </View>
      <View>
        <ButtonLargePrimary title="Close the app" onPress={() => RNExitApp.exitApp()} />
        <InsetSubstitute type="bottom" />
      </View>
    </ScreenContainer>
  );
};
