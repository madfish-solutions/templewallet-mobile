import React, { memo } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import SpInAppUpdates, { IAUUpdateKind, StartUpdateOptions } from 'sp-react-native-in-app-updates';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { isAndroid } from 'src/config/system';

import { InAppUpdateBannerSelectors } from './in-app-update-banner.selectors';
import { useInAppUpdateBannerStyles } from './in-app-update-banner.styles';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export const InAppUpdateBanner = memo<Props>(({ style }) => {
  const styles = useInAppUpdateBannerStyles();

  const handleUpdateButton = () => {
    const inAppUpdates = new SpInAppUpdates(false);
    let updateOptions: StartUpdateOptions = {};

    if (isAndroid) {
      // android only, on iOS the user will be prompted to go to our store page
      updateOptions = {
        updateType: IAUUpdateKind.IMMEDIATE
      };
    }
    inAppUpdates.startUpdate(updateOptions);
  };

  return (
    <View style={[styles.root, style]}>
      <Text style={styles.title}>Update your Temple Wallet app!</Text>
      <Text style={styles.description}>
        🎉 Great news! The newest version of Temple Wallet is available in the store. Please, update your app to unlock
        all the latest improvements.
      </Text>
      <ButtonLargePrimary
        title="Update now"
        onPress={handleUpdateButton}
        textStyle={styles.buttonText}
        buttonStyle={styles.button}
        testID={InAppUpdateBannerSelectors.UpdateNow}
      />
    </View>
  );
});
