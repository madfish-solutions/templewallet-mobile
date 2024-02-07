import React, { memo } from 'react';
import { View, Text, StyleProp, ViewStyle } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { togglePartnersPromotionAction } from 'src/store/partners-promotion/partners-promotion-actions';
import { setAdsBannerVisibilityAction } from 'src/store/settings/settings-actions';

import { InAppUpdateBannerSelectors } from './in-app-update-banner.selectors';
import { useInAppUpdateBannerStyles } from './in-app-update-banner.styles';

interface Props {
  style?: StyleProp<ViewStyle>;
}

export const InAppUpdateBanner = memo<Props>(({ style }) => {
  const dispatch = useDispatch();
  const styles = useInAppUpdateBannerStyles();

  const handleUpdateButton = () => {
    dispatch(togglePartnersPromotionAction(true));
    dispatch(setAdsBannerVisibilityAction(false));
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
